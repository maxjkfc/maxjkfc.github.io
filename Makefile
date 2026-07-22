PORT ?= 8000

# 本機預覽整站（Ctrl-C 結束）
dev:
	python3 -m http.server $(PORT)

# 起 server 並直接打開 Dev Tools
tools:
	python3 -m http.server $(PORT) & sleep 1; open http://localhost:$(PORT)/tools/; wait

.PHONY: dev tools
