# 新教程填写模板

复制本文件改名后，填下面三块。**怎么填、怎么写出好教程，见 `README.md`**——本文件只是填写表 + 锚点参考。
填完发给 Claude：「照这张表加一个新教程」。

规则：用人话写，不懂代码也能填；拿不准就留空或写「？」；一个教程一个文件。

---

## 第一块 · 教程基本信息

| 字段 | 填写 |
|---|---|
| 教程名 |  |
| 分类 |  |
| 难度标签 |  |
| 一句话简介 |  |
| 预计时长 |  |
| 英文 id（可留空） |  |

## 第二块 · 进度轨道（3~6 个里程碑，按顺序）

| 顺序 | 里程碑名 |
|---|---|
| 1 | 开始 |
| 2 |  |
| … |  |
| 末 | 完成 |

## 第三块 · 步骤表（一行一步）

| 序 | 里程碑 | 界面/状态 | 高亮控件 | 卡片标题 | 卡片正文 | 小贴士 | 前进方式 |
|---|---|---|---|---|---|---|---|
| 1 | 开始 | 居中欢迎 | 不高亮 |  | …（含开始前要准备什么） |  | Next |
| 2 |  |  |  |  |  |  | 点击 / Next |
| … |  |  |  |  |  |  |  |
| 末 | 完成 | 完成 | 不高亮 |  | …（含结束后回现实做什么） |  | Next |

> 前进方式：`点击`=点高亮控件才前进（操作步）；`Next`=读完点 Next（讲解步）。
> 别忘了完整链路：开场卡写"准备什么"，结束卡写"接下来在现实里做什么"（详见 README 第四节）。

---

## 锚点参考清单

高亮怎么写：①人话（「高亮第一行复选框」）或 ②锚点名（「ck-0」），任选。
`{i}`=行号/序号，**从 0 起**；`{id}`=固定选项码（见下）。

### ✅ 已埋锚点（直接可用）

| 界面 | 控件 | 锚点名 |
|---|---|---|
| 导航 | 菜单按钮 / Inventory 项 / FBA Inventory 子项 | `burger` / `menu-inventory` / `menu-fba-inventory` |
| 库存列表 | 第 i 行复选框 / 群组操作栏 / 操作下拉 / Send to FBA | `ck-{i}` / `groupbar` / `group-action` / `send-fba` |
| 向导 Step1 | 第 i 个箱数框 / 第 i 个打包详情 / 确认并继续 | `qty-{i}` / `packing-{i}` / `confirm-step1` |
| 打包弹窗 | units per box 字段 | `pack-upb` |
| 向导 Step2 | 运输方式卡 / 配置方案行 / ship from / 确认目的地 | `mode-{id}` / `placement-{id}` / `ship-from` / `confirm-step2` |
| 向导 Step3 | 打印标签 / 第一箱箱重 / 继续到承运商 | `print-labels` / `box-weight` / `continue-step3` |
| 向导 Step4·完成 | 确认承运信息 / 保存物流单号 | `confirm-step4` / `save-tracking` |

固定选项码：
- `mode-{id}`：`agl`(Amazon Global Logistics) · `send`(Amazon SEND) · `own`(自有承运商)
- `placement-{id}`：`optimized`(最优拆分) · `partial`(部分拆分) · `minimal`(最少拆分)

### ⚪ 控件已有，要用我现补锚点

这些控件 Demo 里都有，只是还没埋锚点。要高亮就在表里照常写人话，备注一句「需补锚点」：

| 界面 | 控件 |
|---|---|
| 库存列表 | 表头全选框、行内「Send to FBA」蓝按钮、All SKUs / Restock 标签页、筛选条、搜索框、Reports / Settings |
| 向导 Step1 | 「Confirm to send」确认按钮、All FBA SKUs / SKUs ready to send 标签页 |
| 打包弹窗 | 模板名、模板类型、箱尺寸、箱重、Prep 类别、Close / Delete |
| 箱内容弹窗 | 每箱尺寸、数量输入、删除箱按钮 |
| 选地址弹窗 | Select/Continue、Edit、Add contact |
| 编辑地址弹窗 | 各表单字段、Save / Cancel |
| Shipments 列表页 | Work on shipment / Track shipment、标签页、筛选、搜索、导出 |
| 首页 | Send to Amazon 入口、各卡片 CTA |

### 🆕 还没有的界面

Fix Stranded / Removal Order / AWD / Restock 等占位卡对应的页面 Demo 里还没做。
要做这类教程，需先建界面再埋锚点——立项时单独说明。

### 弹窗怎么写

弹窗在状态里单独控制，不是「高亮目标」。你只要写「打开打包弹窗，高亮箱重字段」，Claude 会自动配上。
现支持：`packing`(打包弹窗) · `boxes`(箱内容弹窗)；地址相关弹窗要用时再接。

> 想看填好的完整范例，参考已上线的 `shipping-plan.js`。
