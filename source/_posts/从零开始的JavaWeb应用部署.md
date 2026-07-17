---
title: 从零开始的JavaWeb应用部署
date: 2026-07-17
author: okiso
tags:
  - 云服务器
  - 部署
  - JavaWeb
  - Linux
categories:
  - 栈记
---
> 从零部署了一个JavaWeb项目后，对JavaWeb应用部署的梳理、思考以及祛魅

## 一、前言

当你测试完最后一段代码，觉得自己手上的 Web 应用总算是能给人看了。问题来了——要怎么让别人看到？

不妨先思考一个问题：开发过程中，我们是如何看到自己应用的？以经典的 **Vue + Spring Boot** 前后端分离项目为例，通过 Node.js 启动前端服务，默认占用 `5173` 端口；通过 Maven 启动后端服务，默认占用 `8080` 端口。**端口**标记了某个应用服务在电脑上的位置，通过端口可以调用该服务。

现在，我们可以在浏览器访问 `localhost:5173`，看到正在运行的前端页面。部分交互只需前端呈现静态资源即可；另一部分则需要将数据发送到 `localhost:8080`（即 Spring Boot 后端服务），经业务代码处理后返回。

既然如此，能不能让别人直接访问 `localhost:5173`，看到我们的应用？先说结论：可以，但没必要。

首先，Vue 开发服务器和 Spring Boot 默认都监听 `localhost（127.0.0.1）`，只接受来自本机的访问，数据仅在电脑内部传输。当别人通过你的局域网 IP（如 `192.168.1.5`）访问时，服务根本不会响应，直接拒绝连接。

当然，可以修改 Vue 和 Spring Boot 的配置，让它们监听所有网卡，即 `0.0.0.0`，接收来自**任何网络接口**的请求：
- 来自本机的 `127.0.0.1`
- 来自局域网其他设备的 `192.168.x.x`
- 如果服务器有公网 IP，也监听来自公网的请求

可这样还不够——Windows 防火墙默认拦截外部设备对端口的访问（保护本机安全）。即使修改入站规则、开放部分端口，依然有最根本的限制：电脑上的 IP（如 `192.168.x.x`）是**局域网私有 IP**，只有同一 Wi-Fi 下的设备可以访问，外网无法连接。

因此，让所有人访问应用的必备条件是**公网 IP**。但还不够，服务需要 24h 不中断，这对个人电脑来说，无论是算力还是日常使用都不太现实。最简便的做法是买一台云服务器——它就是一台适合 24h 开机运行服务的电脑。

所谓**部署**，就是在拥有公网 IP 的服务器上运行我们的服务。所幸现在购买服务器都会附赠公网 IP，我们只需解决两个问题：
1. 如何控制不在眼前的服务器？
2. 如何在服务器上运行我们的服务（服务器常用 **Linux 系统**）？

## 二、虚拟机练习

不妨先用**虚拟机**模拟远程服务器，零成本练手。

### （一） 搭建环境

#### 1. 配置 WSL

常见的选择是 **VMware**，功能全面但较为笨重。这里推荐使用 Windows 自带的 **WSL（Windows Subsystem for Linux）**。
1. **以管理员身份打开 PowerShell**，依次输入：
```powershell
# 启用 WSL 功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 启用虚拟机平台（WSL2 必需）
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 重启电脑（必须）
Restart-Computer
```
2. 重启后，再次打开 PowerShell（普通权限即可），执行：
```powershell
# 设置 WSL2 为默认版本
wsl --set-default-version 2
```

#### 2. 安装 Ubuntu

Ubuntu 是一个流行的 Linux 发行版，在 PowerShell 中直接执行：
```powershell
# 自动下载最新 Ubuntu 发行版并安装
wsl --install -d Ubuntu
```
安装完成后，**首次启动 Ubuntu** 会提示创建用户名和密码：
```text
Enter new UNIX username: 你的用户名（例如 dev）
New password: 输入密码（不显示）
Retype new password: 确认密码
```

### （二）远程连接

现实中的服务器往往在千里之外，我们只知道一个 IP，无法直接操作。这时需要**远程连接**工具，将指令传输到远程服务器中。

对于 WSL，可以直接通过 VSCode 连接：安装 **WSL 拓展**，按 `Ctrl+Shift+P` 选择 `Connect to WSL` 即可。或者在 Ubuntu 终端输入 `code .`，直接在 VSCode 中打开当前目录。这让我们可以通过 VSCode 的可视化界面来操控虚拟机。

当然，更经典的做法是通过 **XShell**、**FinalShell** 等工具远程连接，后面连接云服务器时也会用到。但 WSL 默认没有 **SSH** 服务器的服务，需要自行安装`openssh-server`。

### （三）学习 Linux

关于 Linux 的学习，网上有很多教程：
- [Linux 教程 | 菜鸟教程](https://www.runoob.com/linux/linux-tutorial.html)
- [Linux 基础指令从入门到精通：基础指令、重定向、管道与权限完全指南-CSDN博客](https://blog.csdn.net/meilindehuzi_a/article/details/162811916?spm=1001.2014.3001.5506)
- [A Linux Command Line Primer | DigitalOcean](https://www.digitalocean.com/community/tutorials/a-linux-command-line-primer)

实际上不需要特别深入，部署只需了解**基本指令和目录结构**即可，在实战中会慢慢熟悉。

### （四）部署

基本掌握 Linux 后，就开始部署吧！流程其实很简单：将前后端项目分别**打包**，再分别启动，让服务器持续运行即可。我们只需要把 Windows 上启动项目的流程，用 Linux 的方式走一遍。

#### 1. 安装依赖

先根据项目文档安装所有依赖。Linux 强大的**包管理器**让我们通过指令即可下载软件并自动配置相关环境变量。
```bash
# 连接软件源服务器，下载最新软件包列表并更新本地缓存
sudo apt update
# 升级所有已安装包
sudo apt upgrade -y
# 安装开发常用工具
sudo apt install -y git curl wget vim net-tools
# 安装 OpenJDK 17（Spring Boot 常用）
sudo apt install -y openjdk-17-jdk
# 安装 Maven
sudo apt install maven -y
# 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# 关闭当前终端后重新打开，或执行 source ~/.bashrc，然后：
nvm install 18
nvm alias default 18
# 安装 Nginx（详见前端部署）
sudo apt install nginx -y
# 安装 Docker（如需容器部署）
sudo apt install -y docker.io
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

#### 2. 后端部署

直接执行 `mvn spring-boot:run` 可以启动后端，但只适合开发环境，在生产服务器上性能不佳。经典做法是打包成 jar 文件托管。

##### （1）打包

Maven 负责 Spring Boot 项目的**生命周期**。在项目目录下执行 `mvn clean package`，会在 `target` 目录下生成一个**可执行的 Fat Jar** `app.jar`。这是 Java 项目的打包文件，包含所有编译好的 Class 和依赖，启动速度快，资源占用少。

![](/images/javaweb-maven-package.png)

##### （2）启动

通过**远程连接**工具将 jar 包传输到服务器上合适的位置，执行 `java -jar app.jar` 启动。若 8080 端口被监听，则后端部署成功。

#### 3. 前端部署

前端的部署稍麻烦一些。开发环境中，`npm run dev` 启动的是一个**开发服务器（Dev Server）**，代码未压缩，可以实时编译，但体积巨大。经典做法是打包编译成纯静态文件（压缩后的 `.js` 和 `.css`），然后交给 **Nginx** 这样的专业静态服务器托管。

##### （1）打包

在 Windows 执行 `npm run build`，`dist` 文件夹就是打包产物。

![](/images/javaweb-dist.png)

##### （2）配置 Nginx

**Nginx** 是一款轻量级的**反向代理服务器**，内存占用少、并发能力强。所谓**反向代理**，即服务端的"代理人"：当用户从外网发来请求时，Nginx 统一接收，根据**配置规则**（如请求路径以 `/api/` 开头）转发至实际处理业务的服务器（如 Spring Boot 后端），并取回结果。整个过程对外界完全透明，用户只知道自己在和 Nginx 通信，感受不到背后真实服务器的存在，以此避免跨域、实现安全隔离。此外 Nginx 的**智能调度**还能均衡负载、加速缓存。

前面已经在 Linux 中安装了 Nginx，下面开始配置。一是配置静态资源，让 Nginx 知道呈现什么内容；二是配置规则，让 Nginx 知道如何处理用户交互。

由于 Linux 特殊的目录结构，通过包管理器安装的 Nginx 文件分散在各处。下表为 Nginx 核心文件位置。我们只需关注**站点配置文件**、**站点启用链接**和**默认静态文件根目录**。

| 文件/目录 | 典型路径 |
| --- | --- |
| **主配置文件** | `/etc/nginx/nginx.conf` |
| **站点配置文件** | `/etc/nginx/sites-available/` |
| **站点启用链接** | `/etc/nginx/sites-enabled/` |
| **默认静态文件根目录** | `/var/www/html/` |
| **访问日志** | `/var/log/nginx/access.log` |
| **错误日志** | `/var/log/nginx/error.log` |

###### A.静态资源

通过远程连接工具将打包好的 `dist` 文件夹传输到合适位置，例如 `/root/projects/frontend/dist/`，然后通过软链接配置静态资源：
```bash
# 1. 删除原有的 html 目录（如果存在）
sudo rm -rf /var/www/html
# 2. 创建软链接：让 /var/www/html 指向 dist 目录
sudo ln -s /root/projects/frontend/dist/ /var/www/html
```

###### B.配置规则

Nginx 的**站点配置文件**都放在 `/etc/nginx/sites-available/` 下，真正启用的配置则在 `/etc/nginx/sites-enabled/` 下，通过软链接关联：
```bash
# 假设已在 /etc/nginx/sites-available/ 下创建了 app.conf 配置文件
# 进入 sites-enabled 目录
cd /etc/nginx/sites-enabled/
# 创建软链接（源文件需使用绝对路径）
ln -s /etc/nginx/sites-available/app.conf app.conf
```
`app.conf` 的具体配置内容可根据项目实际情况让 AI 协助编写，主要涉及不同请求路径的处理规则。可用 `nginx -t` 检查配置文件语法是否正确。

##### （3）启动

**systemd** 是 Linux 的**系统和服务管理器**，专门管理系统中运行的各种"服务"（如 Nginx、MySQL、SSH 等）。执行 `systemctl start nginx` 即可启动 Nginx 服务器，默认占用 `80` 端口。

Nginx 常用指令：

| 操作 | 命令 |
| --- | --- |
| **启动** | `systemctl start nginx` |
| **停止** | `systemctl stop nginx` |
| **重启** | `systemctl restart nginx` |
| **平滑重载** | `systemctl reload nginx` |
| **查看状态** | `systemctl status nginx` |

现在，访问 `localhost:80` 即可看到应用。

## 三、云服务器部署

**云服务器（Elastic Compute Service, ECS）** 比物理服务器更简单高效，无需提前购买昂贵硬件，即可快速创建或删除。购买云服务器时会附赠**公网 IP**。国内可在 [阿里云](https://www.aliyun.com)、[腾讯云](https://cloud.tencent.com) 和 [京东云](https://www.jdcloud.com) 等平台购买。

云服务器不像 WSL 那样可以集成到 VSCode 中，其余流程则大同小异。下面主要介绍远程连接。

### （一）远程连接

在 [XSHELL](https://www.xshell.com/zh/xshell/) 下载 XShell，用于远程命令行操作；在 [XFTP](https://www.xshell.com/zh/xftp/) 下载 XFTP，用于可视化文件传输。

> 这里不得不提，我一开始用的是 **FinalShell**（[FinalShell 官网](https://www.hostbuf.com/)），搜索时误入了几个假官网，下载了木马病毒，偷偷在后台挖矿，一下午 CPU 被干烧了，最后靠 agent 排毒才力挽狂澜。吃一堑，长一智。这类网站通常比真官网还精美，极具迷惑性，下载时一定要小心。

注册账号并进入 XShell 后，新建会话，主机填入服务器的**公网 IP**，确定后输入服务器的账号密码即可远程连接。XFTP 同理。

![](/images/javaweb-xshell.png)

最后，只需把之前在虚拟机上完成的部署流程，在 XShell 和 XFTP 上重新走一遍即可。