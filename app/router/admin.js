'use strict';

/**
 * @api {get} /user/:id Get User information
 * @apiVersion 0.1.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'firstname': 'John',
 *       'lastname': 'Doe'
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       'error': 'UserNotFound'
 *     }
 */

module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/login', controller.admin.login);
  router.post('/register', controller.admin.register);
  router.get('/product/list', jwt, controller.product.index);
  router.post('/product/create', jwt, controller.product.create);
  router.put('/product/:id', jwt, controller.product.update);
  router.get('/product/:id', jwt, controller.product.show);
  router.delete('/product/:id', jwt, controller.product.destroy);
  // router.post('/productFile', jwt, controller.productFile.upload);
  router.post('/upload', jwt, controller.productFile.multiUpload);
  router.get('/upload', jwt, controller.productFile.index);
  router.delete('/upload/:id', jwt, controller.productFile.destroy);
  router.resources('category', '/category', controller.category);
};
