interface Feature {
    key: string;
    name?: string;
}

export class FeatureToggleService {
    protected features = new Map<string, string>();

    protected localStoragePrefix = '_feature';

    constructor() {
        localStorage.setItem('_feature._enabled', JSON.stringify(true));
    }

    register(feature: Feature) {
        if (!feature.name) {
            feature.name = feature.key;
        }

        this.features.set(feature.key, feature.name);

        // If the toggle doesn't exist in localStorage yet, we'll set it
        // to be disabled – this makes it a lot easier to then enable
        // since you don't need to remember the prefix and feature.
        if (localStorage.getItem(this.localStorageKey(feature.key)) === null) {
            localStorage.setItem(this.localStorageKey(feature.key), JSON.stringify({ name: feature.name, enabled: false }));
        }
    }

    check(featureKey: string): boolean {
        if (!this.features.has(featureKey)) {
            console.warn(`The feature ${featureKey} has not been registered`);

            return false;
        }

        return JSON.parse(localStorage.getItem(this.localStorageKey(featureKey))).enabled;
    }

    private localStorageKey(featureKey: string): string {
        return `${this.localStoragePrefix}.${featureKey}`;
    }
}