# Troubleshooting Landing Page Issues

## Issue: Can't see landing page at localhost:3000

### Quick Fixes:

#### 1. **Restart the Dev Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

#### 2. **Clear Next.js Cache**
```bash
# Delete .next folder
rm -rf .next
# Or on Windows:
rmdir /s .next

# Then restart
npm run dev
```

#### 3. **Check Browser Console**
- Open browser DevTools (F12)
- Check Console tab for errors
- Look for any red error messages

#### 4. **Verify the Dev Server Started Correctly**
When you run `npm run dev`, you should see:
```
  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 2.3s
```

#### 5. **Check the Terminal for Errors**
Look for compilation errors like:
- Module not found
- TypeScript errors
- Syntax errors

### Common Issues:

#### Issue: Blank White Page
**Solution:** 
- Check browser console for errors
- Make sure all components have 'use client' directive if they use hooks
- Clear browser cache (Ctrl+Shift+Delete)

#### Issue: 404 Page Not Found
**Solution:**
- Make sure `src/app/page.tsx` exists
- Restart dev server
- Clear .next cache

#### Issue: Components Not Rendering
**Solution:**
- Verify all imports are correct
- Check that components are exported properly
- Make sure lucide-react is installed: `npm install lucide-react`

### Verification Steps:

1. **Test Simple Page First**
   
   Temporarily replace `src/app/page.tsx` content with:
   ```tsx
   export default function Home() {
     return <h1>Hello World</h1>
   }
   ```
   
   If this works, the issue is with the components.

2. **Check Each Component**
   
   Import components one by one in page.tsx:
   ```tsx
   'use client';
   
   import { Hero } from '@/components/Hero';
   
   export default function LandingPage() {
     return (
       <div>
         <Hero />
       </div>
     );
   }
   ```

3. **Verify Dependencies**
   ```bash
   npm list lucide-react
   npm list next
   npm list react
   ```

### Still Not Working?

Run these commands:
```bash
# 1. Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# 2. Reinstall dependencies
npm install

# 3. Clear Next.js cache
rm -rf .next

# 4. Start dev server
npm run dev
```

### What Should You See?

When everything works correctly at http://localhost:3000, you should see:
- **Navigation bar** at top with Friction.ai logo
- **Hero section** with gradient text "Customer Service, Solved by Ignoring It"
- **Features section** with 4 feature cards
- **Live Demo section** with ElevenLabs agent widget
- **Footer** at bottom

### Next Steps:

If the page still doesn't load, please share:
1. Terminal output when running `npm run dev`
2. Browser console errors (F12 → Console tab)
3. What you see on the page (blank, error message, etc.)
