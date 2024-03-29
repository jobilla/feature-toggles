export interface Feature {
    key: string;
    name?: string;
}

const features = new Map<string, string>();

export class FeatureToggleService {
    protected localStoragePrefix = '_feature';

    constructor() {
        localStorage.setItem('_feature._enabled', JSON.stringify(true));
    }

    /**
     * Clears the internal feature list. This only exists to be used in tests.
     * Do not use in production code. No really, don't.
     *
     * @private
     */
    static clearInternalFeatureList() {
        features.clear();
    }

    register(feature: Feature) {
        if (!feature.name) {
            feature.name = feature.key;
        }

        features.set(feature.key, feature.name);

        // If the toggle doesn't exist in localStorage yet, we'll set it
        // to be disabled – this makes it a lot easier to then enable
        // since you don't need to remember the prefix and feature.
        if (localStorage.getItem(this.localStorageKey(feature.key)) === null) {
            localStorage.setItem(this.localStorageKey(feature.key), JSON.stringify({ name: feature.name, enabled: false }));
        }
    }

    /**
     * This method is used to tidy up localStorage. It will remove any features
     * that are no longer registered.
     *
     * You should only call this method after registering all features.
     */
    tidyUpLocalStorageData() {
        const registeredFeatures = Array.from(features.keys());
        const keysInLocalStorage = Object.keys(localStorage)
            .filter(key =>
                key.startsWith(this.localStoragePrefix) &&
                key !== `${this.localStoragePrefix}._enabled`
            );

        keysInLocalStorage.forEach(key => {
           const feature = key.replace(`${this.localStoragePrefix}.`, '');

           if (registeredFeatures.indexOf(feature) === -1) {
               localStorage.removeItem(key);
           }
        });
    }

    check(featureKey: string): boolean {
        if (!features.has(featureKey)) {
            console.warn(`The feature ${featureKey} has not been registered`);

            return false;
        }

        const localStorageData = localStorage.getItem(this.localStorageKey(featureKey));
        return localStorageData === null ? false : JSON.parse(localStorageData).enabled;
    }

    private localStorageKey(featureKey: string): string {
        return `${this.localStoragePrefix}.${featureKey}`;
    }
}
