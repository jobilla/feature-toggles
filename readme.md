# Jobilla Feature Toggles

This is a library for use in JavaScript and TypeScript applications to allow you to
conditionally execute code/show some parts of your frontend depending on if a feature is
enabled or not.

This is meant for in-development features where you might want to ship incrementally to
your testing environment but ship the entire feature to your customers. It ensures that
you can still deploy to production, but having unfinished features hidden.

## Installation

 This package can be installed with NPM:
 
 ```
npm install @jobilla/feature-toggles
```

## Usage

First, to activate feature toggles for your app, simply instantiate the service:
```javascript
const toggles = new FeatureToggleService();
```

You may then proceed to register any service you want:
```javascript
toggles.register({
    name: "New Sidebar",
    key: "new_sidebar"
});
```

We recommend that you register **all** your features in the root of your application.

You may then, anywhere in your code, check whether the feature is enabled:

```
if (toggles.check('new_sidebar')) {
    renderNewSidebar();
} else {
    renderOldSidebar();
}
```

### Enabling and disabling features

Features are stored as stringified JSON in `localStorage`. You may either manually change
the `enabled` value for a feature in `localStorage`, or you can use our [companion Chrome
plugin](https://github.com/jobilla/feature-toggles-chrome). 