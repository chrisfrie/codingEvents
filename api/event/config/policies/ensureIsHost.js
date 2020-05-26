module.exports = async(ctx, next) => {
    // Find event in Database
    const event = await strapi.services.event.findOne({id: ctx.params.id});

    if (!event){
        return ctx.notFound();
    };

    // Check if host is matching logged in user
    if (event.host.id != ctx.state.user.id){
        return ctx.forbidden("You have to be the host to edit this event");
    }

    return await next();
};