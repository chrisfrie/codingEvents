'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
    const authenticated = await strapi.query('role', 'users-permissions').findOne({ type: 'authenticated' });
    authenticated.permissions.filter(permission => permission.type == 'application' && !permission.enabled).forEach(permission => {
      strapi.query('permission', 'users-permissions').update( { id: permission.id}, {
        ...permission,
        enabled: true
      });
    });
};
