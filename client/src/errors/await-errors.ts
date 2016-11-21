// Listen for error events on $rootScope and go to corresponding error state

import codes from './codes';

const awaitErrors = (
  $rootScope: ng.IRootScopeService,
  $state: ng.ui.IStateService
) => {
  codes.forEach((code) => {
    $rootScope.$on(code, () => {
      $state.go(code);
    });
  });
};

awaitErrors.$inject = [
  '$rootScope',
  '$state'
];

export default awaitErrors;
