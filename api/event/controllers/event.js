'use strict';
// const { sanitizeEntity } = require('strapi-utils'); // for random getting events
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async random(ctx) { 
        // console.log("Hello");
        const events = await strapi.services.event.find();
        const randomIndex = Math.floor(Math.random() * events.length);
        const randomEvent =events[randomIndex];
        return sanitizeEntity(randomEvent, {model: strapi.models.event});
    },

    // async create(ctx) {
    //     let entity;
    //     if (ctx.is('multipart')) {   // for uploading we use multipart
    //       const { data, files } = parseMultipartData(ctx);
    //       data.host = ctx.state.user.id;
    //       entity = await strapi.services.event.create(data, { files });
    //     } else {
    //       ctx.request.body.host = ctx.state.user.id;
    //       entity = await strapi.services.event.create(ctx.request.body);
    //     }
    //     return sanitizeEntity(entity, { model: strapi.models.event });
    // },

    async create(ctx) {
        const host = ctx.state.user.id;
        let entity;
        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            const {title, date, location} = data;
            const duplicate = await strapi.services.event.findOne({title, date, location});
            if (duplicate) {
                return ctx.forbidden('An event with the same location, title and date already exists');
            }
            entity = await strapi.services.event.create({...data, host}, { files });
        } else {
            const {title, date, location} = ctx.request.body;
            const duplicate = await strapi.services.event.findOne({title, date, location});
            if (duplicate) {
                return ctx.forbidden('An event with the same location, title and date already exists');
            }
            entity = await strapi.services.event.create({...ctx.request.body, host});
        }
        return sanitizeEntity(entity, { model: strapi.models.event });
    },
};
