src
├─ assets
│  ├─ fonts/                  # custom fonts
│  ├─ images/                 # static images
│  └─ icons/                  # SVG/PNG icons
│
├─ components                 # reusable presentational building blocks
│  ├─ common                  # buttons, cards, tables, empty states
│  ├─ layout                  # header, footer, drawer
│  └─ charts                  # LineGraph, BarGraph, DonutGauge, ChartWrapper
│
├─ src
├─ screens
│  ├─ Dashboard
│  │  ├─ CEO_GM_Dashboard.tsx      # CEO/GM → All branches, staff, sales, reports
│  │  ├─ RM_ZM_Dashboard.tsx       # RM/ZM → Own region + subordinate branches/customers
│  │  ├─ ZM_BR_Dashboard.tsx       # ZM/BR → Own branch + subordinate staff/customers
│  │  ├─ BR_AVO_Dashboard.tsx      # BR → Own branch staff + all branch customers
│  │  └─ AVO_AllCustomers.tsx      # AVO → Own assigned customers only
│
│  ├─ Branch
│  │  ├─ BranchList.tsx            # CEO/GM → All branches | RM/ZM → their region only
│  │  ├─ BranchDetail.tsx          # CEO/GM → Any branch | BR → only own branch
│  │  └─ BranchPerformance.tsx     # CEO/GM → global KPIs | RM/ZM → filtered KPIs
│
│  ├─ Customers
│  │  ├─ CustomerList.tsx          # CEO/GM → all | RM/ZM → regional | BR → branch | AVO → own customers
│  │  ├─ CustomerDetail.tsx        # same rule above
│  │  └─ CustomerTransactions.tsx  # same rule above
│
│  ├─ Sales
│  │  ├─ InvoiceList.tsx           # CEO/GM → all invoices | RM/ZM → regional invoices | BR → branch invoices | AVO → own customer invoices
│  │  ├─ InvoiceDetail.tsx         # same rule above
│  │  └─ NewSale.tsx               # BR & AVO only (can register sales/installments for customers)
│
│  ├─ Reports
│  │  ├─ BranchComparison.tsx      # CEO/GM only
│  │  ├─ StaffPerformance.tsx      # CEO/GM → all | RM/ZM → regional staff | BR → branch staff
│  │  ├─ RevenueTrends.tsx         # CEO/GM → org-level | RM/ZM → region-level | BR → branch-level
│  │  └─ RecoveryReport.tsx        # CEO/GM → org-level | RM/ZM → region-level | BR → branch-level | AVO → own customers only
             # reusable dashboard panels
│
├─ navigation
│  ├─ index.tsx               # navigation container
│  ├─ AppNavigator.tsx        # main stack
│  ├─ AuthNavigator.tsx       # auth stack
│  └─ RoleGuard.tsx           # role-based access control
│
├─ redux
│  ├─ store.ts                # configureStore
│  ├─ slices
│  │  ├─ authSlice.ts         # user + role
│  │  ├─ themeSlice.ts        # light/dark theme
│  │  └─ dashboardSlice.ts    # mock dashboard data
│  └─ selectors.ts            # central selectors
│
├─ hooks
│  ├─ useAuth.ts              # auth state
│  ├─ useTheme.ts             # theme toggle
│  ├─ usePermissions.ts       # ACL check with hierarchy
│  └─ useResponsive.ts        # responsive UI
│
├─ services
│  └─ mock
│     ├─ mockApi.ts           # simulate API latency
│     └─ dashboardData.ts     # dummy dashboard data
│
├─ styles
│  ├─ theme.ts                # colors, typography, spacing
│  └─ globalStyles.ts
│
├─ types
│  └─ index.ts                # Role enums, DTOs
│
├─ utils
│  ├─ formatters.ts           # currency/date helpers
│  └─ permissions.ts          # hierarchy ACL (CEO > GM > RM > ZM > BR > AVO)
│
├─ data
│  └─ seed/
│     └─ customers.json       # mock customer dataset
│
└─ README.md


data/seed
├─ branches.json   # CEO/GM full | RM/ZM filtered by region | BR only their branch
├─ staff.json      # CEO/GM full | RM/ZM filtered | BR sees own staff | AVO → N/A
├─ customers.json  # CEO/GM all | RM/ZM regional | BR branch | AVO only assigned
├─ sales.json      # CEO/GM all | RM/ZM regional | BR branch | AVO own customers
└─ payments.json   # CEO/GM all | RM/ZM regional | BR branch | AVO own customers


I want this file structure, 

Scaffold a React Native CLI (TypeScript) src/ frontend with this file structure (assets, reusable components, role-based dashboards, navigation, redux, hooks, services/mock, styles, utils, data) where access control follows hierarchy (CEO > GM > RM > ZM > BR > AVO) meaning every upper role inherits all lower roles’ permissions, implement Redux Toolkit store with auth/theme/dashboard slices, RoleGuard HOC with hierarchy logic, 3 professional charts (Donut KPI “Total Due”, Multi-series Line “Total Count” 7-day trend, Stacked Bar “Total Paid” by branch) using victory-native + react-native-svg, dummy data in dashboardData.ts via promise-based mockApi.ts, reusable KPI/Card/GraphsPanel components, responsive hook, light/dark theme, and output ready-to-paste TypeScript code for: store.ts, authSlice.ts, dashboardSlice.ts, RoleGuard.tsx, LineGraph.tsx, DashboardHome.tsx, mockApi.ts, dashboardData.ts, theme.ts, plus package.json dependencies and run commands.

top herarichy can navigate to bottom heirarcy to see the data,
there are many branches, reigins, customers data, 
add more text and suitable data in dashboards,
UI should be modern, responsive, full of data, resusable components,like modal, touchable opacity, inputfields, etc
don't make any changes in package.json file, 

think deep and start work on it

