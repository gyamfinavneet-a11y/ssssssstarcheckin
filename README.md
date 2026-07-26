# 星星签到系统 - Vercel 部署版

部署到 Vercel 获得固定公网地址，任何网络均可扫码签到。

## 文件结构

```
star-checkin-vercel/
├── vercel.json              # Vercel 配置
├── package.json
├── api/                     # Serverless 函数
│   ├── _members.js          # 38人成员初始数据
│   ├── _redis.js            # Upstash Redis 封装
│   ├── members.js           # GET 获取成员列表
│   ├── checkin.js           # POST 签到
│   └── reset.js             # POST 重置签到
├── public/                  # 静态页面
│   ├── index.html           # 首页（入口）
│   ├── screen.html          # 大屏端
│   └── checkin.html         # 签到端（手机）
└── README.md
```

## 部署步骤（约 5 分钟）

### 第 1 步：上传到 GitHub

1. 将 `star-checkin-vercel` 文件夹上传到你的 GitHub 仓库
   - 方式一：在 GitHub 创建新仓库，上传所有文件
   - 方式二：`git init && git add . && git commit -m "star checkin" && git push`

### 第 2 步：在 Vercel 导入项目

1. 打开 [vercel.com](https://vercel.com)，用 GitHub 账号登录
2. 点击 "Add New Project"
3. 选择你刚上传的仓库
4. Framework Preset 选 "Other"，其他默认
5. 点击 "Deploy"（先别急，下一步要加数据库）

### 第 3 步：添加 Upstash Redis（免费数据库）

1. 进入刚部署的 Vercel 项目
2. 点击 "Storage" 标签
3. 点击 "Create Database" → 选择 "Upstash Redis"
4. 创建完成后，Vercel 会自动设置环境变量：
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
5. 点击 "Redeploy" 重新部署

> 也可以去 [upstash.com](https://upstash.com) 单独注册，获取 REST URL 和 Token，
> 然后在 Vercel 项目的 Settings → Environment Variables 中手动添加：
> - `UPSTASH_REDIS_REST_URL`
> - `UPSTASH_REDIS_REST_TOKEN`

### 第 4 步：使用

部署完成后你会得到一个固定地址，如：
```
https://star-checkin-xxx.vercel.app
```

- **大屏端**：浏览器打开 `https://star-checkin-xxx.vercel.app/screen.html`
- **签到端**：手机扫码或打开 `https://star-checkin-xxx.vercel.app/checkin.html`
- 大屏右下角二维码自动指向签到端地址

## 与本地版的区别

| 对比项 | 本地版 (star-checkin) | Vercel 版 |
|--------|----------------------|-----------|
| 地址 | localtunnel 临时地址 | Vercel 固定地址 |
| 实时同步 | WebSocket（0延迟） | 轮询（2秒间隔） |
| 数据存储 | 服务器内存 | Upstash Redis |
| 二维码 | 服务端生成 | 客户端生成 |
| 需要运行 | 电脑开着服务 | 24小时在线 |

## 注意事项

- 轮询间隔：大屏 2 秒，签到端 3 秒（签到后最多 2 秒延迟）
- Upstash 免费额度：每天 10,000 次命令（签到场景完全够用）
- 首次访问自动初始化 38 人数据
- 重置签到：大屏右上角"重置签到"按钮，或调用 `POST /api/reset`
