import express = require('express');

export default {
  '404': function pageNotFound(req: express.Request, res: express.Response) {
    var viewFilePath = '404';
    var statusCode = 404;
    var result = {
      status: statusCode
    };

    res.status(result.status);
    res.render(viewFilePath, {}, function(err, html) {
      if(err) {
        return res.status(result.status).json(result);
      }
      res.send(html);
    });
  }
}
