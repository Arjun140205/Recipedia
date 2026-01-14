# Recipedia - API Documentation

## Base URL
- **Production**: `https://recipedia-2si5.onrender.com/api`
- **Development**: `http://localhost:8000/api`

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### POST `/signup`
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created successfully"
}
```

---

#### POST `/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "token": "jwt_token_string",
  "userId": "user_id"
}
```

---

### Recipes

#### GET `/recipes`
Fetch paginated recipes.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |

**Response:** `200 OK`
```json
{
  "recipes": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalRecipes": 50
}
```

---

#### GET `/recipes/:id`
Fetch single recipe by ID.

**Response:** `200 OK`
```json
{
  "_id": "string",
  "title": "string",
  "ingredients": "string",
  "instructions": "string",
  "image": "string",
  "category": "string",
  "prepTime": 30,
  "userId": "string"
}
```

---

#### POST `/recipes` 🔒
Create a new recipe (requires authentication).

**Content-Type:** `multipart/form-data`

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| title | string | Yes |
| ingredients | string | Yes |
| instructions | string | Yes |
| category | string | Yes |
| prepTime | number | Yes |
| description | string | No |
| image | file | No |
| video | file | No |
| tags | string | No |
| isPublic | boolean | No |

**Response:** `201 Created`

---

#### PUT `/recipes/:id` 🔒
Update an existing recipe.

**Response:** `200 OK`

---

#### DELETE `/recipes/:id` 🔒
Delete a recipe.

**Response:** `200 OK`

---

### FridgeMate

#### POST `/recipes/match` 🔒
Find recipes matching user's ingredients.

**Request Body:**
```json
{
  "ingredients": ["chicken", "tomato", "onion"],
  "filters": {
    "vegetarian": false,
    "maxPrepTime": 60
  },
  "minMatch": 60
}
```

**Response:** `200 OK`
```json
[
  {
    "_id": "recipe_id",
    "title": "Chicken Curry",
    "matchPercentage": 85
  }
]
```

---

### User Profile

#### GET `/user/profile` 🔒
Get current user's profile.

#### GET `/user/profile/:userId`
Get public profile by user ID.

#### PUT `/user/profile` 🔒
Update profile with optional avatar upload.

---

### Creators

#### GET `/creators`
Fetch paginated list of recipe creators.

**Query Parameters:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 12 |

---

### Social

#### POST `/recipes/:id/like` 🔒
Toggle like on a recipe.

#### GET `/recipes/:id/share`
Generate shareable content for a recipe.

---

## External APIs

### TheMealDB
- `GET /external-recipes/search?query=` - Search recipes
- `GET /external-recipes/categories` - Get categories
- `GET /external-recipes/category/:category` - Filter by category
- `GET /external-recipes/:id` - Get recipe details

---

## Error Responses

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Invalid/missing token |
| 404 | Not Found |
| 500 | Server Error |
