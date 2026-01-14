# Recipedia - System Logic & Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Pages   │  │Components│  │  Hooks   │  │ Services │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Express)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Routes  │  │Middleware│  │ Services │  │  Models  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Mongoose
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MongoDB Atlas                                │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  Users Collection│  │ Recipes Collection│                     │
│  └──────────────────┘  └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Authentication Flow

```
┌──────┐          ┌──────────┐          ┌──────────┐          ┌─────────┐
│Client│          │  Server  │          │  bcrypt  │          │ MongoDB │
└──┬───┘          └────┬─────┘          └────┬─────┘          └────┬────┘
   │   POST /signup    │                     │                     │
   │──────────────────▶│                     │                     │
   │                   │   hash(password)    │                     │
   │                   │────────────────────▶│                     │
   │                   │◀────────────────────│                     │
   │                   │           save user with hash             │
   │                   │──────────────────────────────────────────▶│
   │   201 Created     │                     │                     │
   │◀──────────────────│                     │                     │
   │                   │                     │                     │
   │   POST /login     │                     │                     │
   │──────────────────▶│                     │                     │
   │                   │   compare(pwd,hash) │                     │
   │                   │────────────────────▶│                     │
   │                   │◀────────────────────│                     │
   │                   │   generate JWT      │                     │
   │   { token, userId }                     │                     │
   │◀──────────────────│                     │                     │
```

---

### FridgeMate Recipe Matching Algorithm

```
┌────────────────────────────────────────────────────────────────┐
│                   RecipeMatchService Logic                      │
└────────────────────────────────────────────────────────────────┘

INPUT: User Ingredients Array
       ▼
┌──────────────────────────┐
│ Normalize to lowercase   │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│ For each Recipe:         │
│  - Split into Required   │
│    vs Optional ingredients│
└────────────┬─────────────┘
             ▼
┌──────────────────────────────────────────────┐
│ Calculate Match:                              │
│                                               │
│ requiredScore = matched / total required      │
│ optionalScore = matched / total optional      │
│                                               │
│ totalScore = (requiredScore × 0.7) +          │
│              (optionalScore × 0.3)            │
│                                               │
│ matchPercentage = round(totalScore × 100)     │
└────────────┬─────────────────────────────────┘
             ▼
┌──────────────────────────┐
│ Filter: matchPercentage  │
│         >= minMatch (60%)│
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│ Sort by matchPercentage  │
│ descending               │
└────────────┬─────────────┘
             ▼
OUTPUT: Sorted Recipe Array with Match %
```

---

### Infinite Scroll & Virtualization

```
┌─────────────────────────────────────────────────────────────┐
│              useInfiniteScroll Hook State                    │
│                                                              │
│   recipeState: {                                             │
│     byId: { "id1": {...}, "id2": {...} }  ← Normalized       │
│     allIds: ["id1", "id2", ...]           ← ID Array         │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                Initial Load (LCP Optimized)                  │
│                                                              │
│  1. Fetch first 6 recipes (above-the-fold)                  │
│  2. Render immediately                                       │
│  3. Background: Fetch 24 more recipes after 100ms delay     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Scroll Handler                            │
│                                                              │
│  if (scrollPosition >= 80% of page) {                       │
│    if (!isLoading && hasMore && !pageAlreadyLoaded) {       │
│      loadMoreRecipes(nextPage)                              │
│    }                                                         │
│  }                                                           │
│                                                              │
│  Throttled: 200ms debounce                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              VirtualizedRecipeGrid (React Virtuoso)          │
│                                                              │
│  - Only renders visible items + 200px overscan              │
│  - Custom memoization to prevent re-renders                 │
│  - Priority loading for first 6 items                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── Navbar
│   └── NoodleBowlLogo (SVG Animation)
├── Routes
│   ├── About (Landing Page)
│   ├── Recipes
│   ├── FridgeMate
│   │   ├── RecipeCard
│   │   └── RecipeModal
│   ├── Creators
│   │   └── CreatorCard
│   ├── CreatorProfile
│   ├── Login
│   ├── Signup
│   └── Dashboard (Protected)
│       ├── VirtualizedRecipeGrid
│       │   └── RecipeCard
│       ├── RecipeModal
│       ├── EnhancedShare
│       ├── CreatorProfileEdit
│       └── FoodLoader
├── Footer
└── ToastContainer
```

---

## Database Schema UML

```
┌──────────────────────────────────────────────────────┐
│                        User                           │
├──────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                   │
│ username: String (unique, required)                  │
│ email: String (unique, sparse)                       │
│ password: String (hashed)                            │
├──────────────────────────────────────────────────────┤
│ profile: {                                           │
│   displayName, bio, avatar, location,                │
│   specialties[], isCreator, followers[],             │
│   following[], totalRecipes, totalLikes              │
│ }                                                    │
├──────────────────────────────────────────────────────┤
│ pantryIngredients: [{ name, category, addedDate }]   │
│ dietaryPreferences: { vegetarian, vegan, glutenFree }│
│ timestamps: { createdAt, updatedAt }                 │
└──────────────────────────────────────────────────────┘
                          │
                          │ userId (FK)
                          ▼
┌──────────────────────────────────────────────────────┐
│                       Recipe                          │
├──────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                   │
│ title: String (required)                             │
│ description: String                                  │
│ ingredients: [{ name, amount, optional }]            │
│ instructions: String (required)                      │
│ image: String (path)                                 │
│ video: String (path)                                 │
│ category: String (required)                          │
│ prepTime: Number (minutes)                           │
│ difficulty: Enum [easy, medium, hard]                │
│ dietary: { vegetarian, vegan, glutenFree }           │
│ servings: Number                                     │
│ popularity: Number                                   │
│ likes: [{ userId, createdAt }]                       │
│ totalLikes: Number                                   │
│ shares: Number                                       │
│ isPublic: Boolean                                    │
│ tags: String[]                                       │
│ userId: ObjectId (FK → User)                         │
│ timestamps: { createdAt, updatedAt }                 │
└──────────────────────────────────────────────────────┘
```

---

## Caching Strategy

```
┌────────────────────────────────────────────────────────────┐
│                   Server-Side Caching                       │
│                     (NodeCache)                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  /api/external-recipes/search      │  TTL: 5 min (300s)    │
│  /api/external-recipes/categories  │  TTL: 60 min (3600s)  │
│  /api/external-recipes/category/:c │  TTL: 10 min (600s)   │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                   Client-Side Caching                       │
│               (useInfiniteScroll Hook)                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Normalized State: { byId: {}, allIds: [] }                │
│  - Prevents duplicate API calls for loaded pages           │
│  - loadedPagesRef tracks fetched page numbers              │
│  - Object identity preserved for React.memo optimization  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Security Measures

| Layer | Mechanism |
|-------|-----------|
| Authentication | JWT tokens with 24h expiry |
| Password Storage | bcrypt with salt rounds = 10 |
| XSS Protection | DOMPurify sanitization on user input |
| API Security | Authorization middleware on protected routes |
| File Uploads | Multer with disk storage, filename sanitization |
