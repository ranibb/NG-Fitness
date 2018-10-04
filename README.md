# FitnessTracker

## 

```TypeScript
    getUser() {
        // return this.user;
        return { ...this.user };
    }
```

user is private to the AuthService class so it's not accessible to the outside. Therefore, we could return this user by getUser function. 

Since it's an object and therefore a reference type, other parts of the app could actually change that object and therefore change the object in the service.

To prevent this, return a new object and use the object spread operator to spread the properties of the user object stored in the service into this new object.

This will break this reference and actually return a brand new user that has the same properties but as a different object.

So if other parts of the app start manipulating this object which we return here they won't manipulate this original user which is a better practice than directly returning the user.