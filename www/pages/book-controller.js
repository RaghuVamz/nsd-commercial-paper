/**
 * @class BookController
 * @classdesc
 * @ngInject
 */
function BookController($scope, BookService, ConfigLoader) {

  var ctrl = this;

  ctrl.list = [];

  /**
   *
   */
  ctrl.init = function(){
      $scope.$on('chainblock-ch-'+ BookService.getChannelID(), ctrl.reload);
      ctrl.reload();
  }

  /**
   *
   */
  ctrl.reload = function(){
    ctrl.invokeInProgress = true;
    return BookService.list()
      .then(function(list){
        // add 'org' and 'deponent' to the result, based on account+division
        list.forEach(function(item){
          item.org = ConfigLoader.getOrgByAccountDivision(item.balance.account, item.balance.division);
          item.deponent = (ConfigLoader.getAccount(item.org) || {}).dep;
        })
        ctrl.list = list;
      })
      .finally(function(){
        ctrl.invokeInProgress = false;
      });
  }


  ctrl.init();
}

angular.module('nsd.controller.book', ['nsd.service.book'])
.controller('BookController', BookController);