# BeastFlag - 斗兽棋在线对战

基于 WebSocket 的在线斗兽棋（兽棋）对战游戏，支持创建房间、双人对战和观战模式。

## 功能特性

- WebSocket 实时通信，房间制匹配
- 完整斗兽棋规则（鼠吃象、陷阱、河流等）
- 支持观战模式
- 触摸拖拽移动棋子
- HTTPS 安全连接

## 技术栈

- 前端：HTML + CSS + jQuery
- 后端：Node.js + Express + WebSocket (ws)
- 数据库：MongoDB
- 安全：HTTPS + SSL 证书

## 运行方式

1. 安装依赖：`npm install`
2. 启动服务：`node app.js`
3. 浏览器访问 `https://localhost:端口`

## 游戏规则

斗兽棋是经典双人策略棋类游戏，双方各有8只动物棋子，从大到小为：象、狮、虎、豹、狼、狗、猫、鼠。大吃小，但鼠可吃象。棋盘包含河流、陷阱等特殊地形。
