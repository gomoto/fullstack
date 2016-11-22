enableStormpath.$inject = [
  '$stormpath'
];

function enableStormpath($stormpath: ng.stormpath.IStormpathService) {
  $stormpath.uiRouter({
    defaultPostLoginState: 'dashboard',
    forbiddenState: 'home',
    loginState: 'login'
  });
}

export default enableStormpath;
