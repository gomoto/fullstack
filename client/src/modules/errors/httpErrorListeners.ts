const errorCodes = ['403', '404'];

const httpErrorListeners = (
  $rootScope: ng.IRootScopeService,
  $state: ng.ui.IStateService
) => {
  // Go to error state corresponding event is emitted on $rootScope.
  errorCodes.forEach((errorCode) => {
    $rootScope.$on(errorCode, function() {
      $state.go(errorCode);
    });
  });
};

httpErrorListeners.$inject = [
  '$rootScope',
  '$state'
];

export default httpErrorListeners;
