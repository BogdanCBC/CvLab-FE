import logov2 from '../images/logov2.png';
import rgisLogo from '../images/rgis.png';

export const TENANT_CONFIG = {
    rgis: {
        logo: rgisLogo,
        templates: ['RGIS'],
    },
    default: {
        logo: logov2,
        templates: ['FeelIT', 'RGIS', 'ISE'],
    },
    feelit: {
        logo: logov2,
        templates: ['FeelIT', 'RGIS', 'ISE'],
    }
};

export const getTenantConfig = () => {
    const clientName = localStorage.getItem('clientName') || 'default';
    return TENANT_CONFIG[clientName] || TENANT_CONFIG.default;
};