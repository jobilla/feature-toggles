import { FeatureToggleService } from '../src/FeatureToggleService';

describe('Feature toggling', () => {
    beforeEach(() => {
        localStorage.clear();
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

    it('it considers a feature disabled if it is not set to on', () => {
        const service = new FeatureToggleService();

        service.register({
            name: 'Foo',
            key: 'foo',
        });

        expect(service.check('foo')).toBe(false);
    });

    it('it considers a feature disabled if the localStorage key is missing', () => {
        const service = new FeatureToggleService();

        service.register({
            name: 'Foo',
            key: 'foo',
        });

        localStorage.clear();

        expect(service.check('foo')).toBe(false);
    });

    it('it considers a feature enabled if it is set to on', () => {
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
});
