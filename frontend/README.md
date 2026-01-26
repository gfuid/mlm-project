# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# 🎯 COMPLETE SETUP: My Team Page

## 📁 Files Created:

1. **MyTeam.jsx** - Main team page component
2. **App-with-MyTeam.jsx** - Updated App.jsx with route

---

## ✅ FEATURES:

### 1. **Dual View Modes**
- ✅ **List View** - Table format with search
- ✅ **Tree View** - Hierarchical structure with expand/collapse

### 2. **Real-Time Stats**
- ✅ Total team members
- ✅ Active members count
- ✅ Visual status badges

### 3. **Search Functionality**
- ✅ Search by member name
- ✅ Search by member ID
- ✅ Real-time filtering

### 4. **Tree Features**
- ✅ Collapsible nodes
- ✅ Auto-expand first 2 levels
- ✅ Shows children count
- ✅ Visual hierarchy with indentation
- ✅ Color-coded status (admin/active/pending)

---

## 🚀 INSTALLATION STEPS:

### Step 1: Add MyTeam.jsx
```bash
# Create file in:
frontend/src/pages/MyTeam.jsx
```

Copy the content from `MyTeam.jsx` file I provided.

---

### Step 2: Update App.jsx

Add this import:
```javascript
import MyTeam from './pages/MyTeam';
```

Add this route:
```javascript
<Route
    path="/my-team"
    element={
        <ProtectedRoute>
            <MyTeam />
        </ProtectedRoute>
    }
/>
```

Or simply replace your entire `App.jsx` with `App-with-MyTeam.jsx`.

---

### Step 3: Add Navigation Link

In your `Dashboard.jsx` header or sidebar, add a link:

```javascript
<Link 
    to="/my-team"
    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 text-white hover:bg-orange-700 font-black uppercase text-xs transition"
>
    <Users size={16} />
    View My Team
</Link>
```

---

## 🎨 STYLING:

The component uses your existing Tailwind classes:
- ✅ Consistent design system
- ✅ Same color scheme (orange/gray)
- ✅ Responsive layout
- ✅ Smooth animations

---

## 🔧 HOW IT WORKS:

### Data Flow:
```
MyTeam Component Mounts
    ↓
Fetch tree data from /admin/tree/{userId}
    ↓
Store full tree structure
    ↓
Flatten tree into list for table view
    ↓
Render based on viewMode
```

### Tree Structure:
```javascript
{
    userId: "KARAN1001",
    name: "Karan",
    isActive: true,
    children: [
        {
            userId: "KARAN2",
            name: "Member 1",
            isActive: true,
            children: [...]
        }
    ]
}
```

---

## 📊 VIEW MODES:

### List View:
```
╔════════════╦═══════════╦═════════╗
║ Member ID  ║   Name    ║  Status ║
╠════════════╬═══════════╬═════════╣
║ KARAN2     ║ Sagar     ║ Active  ║
║ KARAN3     ║ Demo      ║ Pending ║
╚════════════╩═══════════╩═════════╝
```

### Tree View:
```
📦 KARAN1001 (You)
├── 📦 KARAN2 (Active) [2 members]
│   ├── 📦 KARAN4 (Active)
│   └── 📦 KARAN5 (Pending)
└── 📦 KARAN3 (Pending)
```

---

## 🧪 TESTING:

### Test Case 1: Empty Team
```
Expected: Shows "No team members yet"
Actual: Check with new user with no referrals
```

### Test Case 2: With Members
```
Expected: Shows list and tree correctly
Actual: Check with user who has referrals
```

### Test Case 3: Search
```
Input: "sagar"
Expected: Filters to show only matching members
```

### Test Case 4: Tree Expansion
```
Action: Click chevron icon
Expected: Expands/collapses children
```

---

## 🐛 DEBUGGING:

### Check Console Logs:
```javascript
✅ Team data loaded: {totalMembers: 5, activeMembers: 3}
```

### Common Issues:

**Issue 1: "No team members"**
- Check if backend `/admin/tree/:userId` is working
- Verify user has referrals in database

**Issue 2: Tree not rendering**
- Check `treeData` in console
- Verify tree structure is correct

**Issue 3: 401 Unauthorized**
- Token expired - re-login
- Check axios interceptor

---

## 💡 CUSTOMIZATION:

### Change Colors:
```javascript
// Replace orange with your brand color
bg-orange-600 → bg-blue-600
text-orange-600 → text-blue-600
border-orange-100 → border-blue-100
```

### Add More Filters:
```javascript
const [statusFilter, setStatusFilter] = useState('all');

const filteredTeam = teamList.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? member.isActive : !member.isActive);
    return matchesSearch && matchesStatus;
});
```

### Add Export Feature:
```javascript
const exportToCSV = () => {
    const csv = teamList.map(m => 
        `${m.userId},${m.name},${m.isActive ? 'Active' : 'Pending'}`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-team.csv';
    a.click();
};
```

---

## 🚀 ADVANCED FEATURES (Optional):

### 1. **Pagination**
```javascript
const [page, setPage] = useState(1);
const itemsPerPage = 20;
const paginatedTeam = filteredTeam.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
);
```

### 2. **Sorting**
```javascript
const [sortBy, setSortBy] = useState('name');
const sortedTeam = [...filteredTeam].sort((a, b) => 
    a[sortBy].localeCompare(b[sortBy])
);
```

### 3. **Member Details Modal**
```javascript
const [selectedMember, setSelectedMember] = useState(null);

<tr onClick={() => setSelectedMember(member)}>
    ...
</tr>
```

---

## 📱 MOBILE RESPONSIVE:

The component is fully responsive:
- ✅ Stacks on small screens
- ✅ Horizontal scroll for table
- ✅ Touch-friendly buttons
- ✅ Proper spacing

---

## ✅ FINAL CHECKLIST:

Before going live:

- [ ] MyTeam.jsx added to project
- [ ] Route added to App.jsx
- [ ] Navigation link added
- [ ] Tested list view
- [ ] Tested tree view
- [ ] Tested search
- [ ] Tested with empty team
- [ ] Tested with large team (100+ members)
- [ ] Mobile view tested
- [ ] Console has no errors

---

## 🎉 RESULT:

After setup:
- ✅ Users can view their team in 2 formats
- ✅ Easy search and filtering
- ✅ Visual hierarchy in tree view
- ✅ Professional, clean interface
- ✅ Fast and responsive

---

## 📞 SUPPORT:

If something doesn't work:

1. Check console for errors
2. Verify API endpoint `/admin/tree/:userId` works
3. Check if user has token in localStorage
4. Verify tree structure matches expected format

---

## 🔗 QUICK ACCESS:

After setup, access at:
```
http://localhost:5173/my-team
```

---

Happy coding! 🚀