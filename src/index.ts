import type { Core } from '@strapi/strapi';

const PUBLIC_READ_ACTIONS = [
  'api::spectacle.spectacle.find',
  'api::spectacle.spectacle.findOne',
  'api::category.category.find',
  'api::category.category.findOne',
];

async function ensurePublicRead(strapi: Core.Strapi) {
  try {
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    for (const action of PUBLIC_READ_ACTIONS) {
      const existing = await strapi.db
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action, role: publicRole.id } });

      if (!existing) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id },
        });
      }
    }
  } catch (e) {
    strapi.log.warn(
      'Permissions publiques: activez find/findOne dans Admin > Users & Permissions > Public'
    );
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublicRead(strapi);
  },
};
