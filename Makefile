HUGO_PORT=1313
GO_PORT=8080
CADDY_PORT=3000

.PHONY: dev stop

dev:
	@echo "http://localhost:$(CADDY_PORT)..."
	go run main.go & 
	hugo server --port $(HUGO_PORT) --liveReloadPort $(CADDY_PORT) --appendPort=false &
	caddy run --config Caddyfile

stop:
	-pkill -f "hugo server"
	-pkill -f "go run main.go"
	-pkill -f "caddy run"