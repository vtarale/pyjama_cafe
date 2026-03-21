package main

import (
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"time"
)

// Global state for rate limiting
var (
	userStats = sync.Map{} // map[string]*usageRecord
	limit     = 10
)

type usageRecord struct {
	count     int
	lastReset time.Time
}

func main() {
	// http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	/*http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/" {
            http.NotFound(w, r)
            return
        }
        http.ServeFile(w, r, "index.html")
    })*/

	http.HandleFunc("/execute", handleExecute)
	fmt.Println("Secure Rate-Limited Executor starting on :8080...")
	http.ListenAndServe(":8080", nil)
}

func isRateLimited(ip string) bool {
	now := time.Now()
	val, _ := userStats.LoadOrStore(ip, &usageRecord{count: 0, lastReset: now})
	record := val.(*usageRecord)

	// Reset if 24 hours have passed since the first request of the "day"
	if now.Sub(record.lastReset) > 24*time.Hour {
		record.count = 0
		record.lastReset = now
	}

	if record.count >= limit {
		return true
	}

	record.count++
	return false
}

func handleExecute(w http.ResponseWriter, r *http.Request) {
	// 1. Get Client IP and check limit
	ip, _, _ := net.SplitHostPort(r.RemoteAddr)
	if isRateLimited(ip) {
		http.Error(w, "Daily limit reached (10 runs per day)", http.StatusTooManyRequests)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Read and Validate
	r.Body = http.MaxBytesReader(w, r.Body, 1*1024*1024)
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "File too large", http.StatusRequestEntityTooLarge)
		return
	}

	// 2. Concurrency Safety: Isolated Workspace
	tmpDir, _ := os.MkdirTemp("", "worker-*")
	defer os.RemoveAll(tmpDir)

	sourcePath := filepath.Join(tmpDir, "main.c")
	binaryPath := filepath.Join(tmpDir, "app")
	os.WriteFile(sourcePath, body, 0644)

	// 3. Compile with Timeout
	ctxC, cancelC := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancelC()

	if out, err := exec.CommandContext(ctxC, "gcc", sourcePath, "-o", binaryPath).CombinedOutput(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Compile Error:\n%s", out)
		return
	}

	// 4. Run with Timeout
	ctxR, cancelR := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancelR()

	cmd := exec.CommandContext(ctxR, binaryPath)
	output, _ := cmd.CombinedOutput()

	if ctxR.Err() == context.DeadlineExceeded {
		http.Error(w, "Execution Timeout", http.StatusGatewayTimeout)
		return
	}

	w.Write(output)
}