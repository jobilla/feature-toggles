import { FeatureToggleService } from '../src/FeatureToggleService';

describe('Feature toggling', () => {
    beforeEach(() => {
        localStorage.clear();
        FeatureToggleService.clearInternalFeatureList();
    });

    it('can register a feature', () => {
        const service = new FeatureToggleService();

        service.register({
            name: 'Foo',
            key: 'foo',
        });

        expect(JSON.parse(localStorage.getItem('_feature.foo'))).toEqual({
            name: 'Foo',
            enabled: false,
        });
    });

    it('will not write to localStorage on registration if the key is already set', () => {
        const service = new FeatureToggleService();

        localStorage.setItem('_feature.foo', JSON.stringify({ name: 'Foo', enabled: true }));

        service.register({
            name: 'Foo',
            key: 'foo',
        });

        expect(JSON.parse(localStorage.getItem('_feature.foo')).enabled).toBe(true);
    });

    it('considers a feature disabled if it is not set to on', () => {
        const service = new FeatureToggleService();

        service.register({
            name: 'Foo',
            key: 'foo',
        });

        expect(service.check('foo')).toBe(false);
    });

    it('considers a feature disabled if the localStorage key is missing', () => {
        const service = new FeatureToggleService();

        service.register({
            name: 'Foo',
            key: 'foo',
        });

        localStorage.clear();

        expect(service.check('foo')).toBe(false);
    });

    it('considers a feature enabled if it is set to on', () => {
        const service = new FeatureToggleService();

        service.register({
            name: 'Foo',
            key: 'foo',
        });

        localStorage.setItem('_feature.foo', JSON.stringify({
            name: 'Foo',
            enabled: true,
        }));

        expect(service.check('foo')).toBe(true);
    });

    describe('tidyUp method', () => {
        it('removes the features that is not registered from localStorage', () => {
            localStorage.setItem('_feature.some_old_feature', JSON.stringify({
                name: 'Old feature that we will no longer register',
                enabled: true,
            }));

            const service = new FeatureToggleService();
            service.register({
                name: 'Some new feature',
                key: 'some_new_feature',
            });

            service.tidyUp();

            expect(localStorage.getItem('_feature.some_old_feature')).toBeNull();
        });
    });
});
