'use strict';

angular.module('leaderboards', []);
angular.module('leaderboards').value('d3', d3);

angular.module('leaderboards').service('api', function () {
    return {
        get: {
            leaderlists: function () {
                return [
                    {
                        id: 1,
                        name: 'Dials'
                    },
                    {
                        id: 2,
                        name: 'Emails'
                    },
                    {
                        id: 3,
                        name: 'Revenue'
                    }
                ];
            }
        }
    };
});

angular.module('leaderboards').directive('leaderlist', function (d3) {
    function linker($scope, elem, attrs) {
        var $elem = d3.select(elem[0]).select('div');

        $scope.$watch("leaderlist.active", function (active) {
            if (active) {
                $elem.transition()
                    .duration(1000)
                    .ease('exp-out')
                    .style('left', '0px');
            } else {
                $elem.transition()
                    .duration(1000)
                    .ease('exp-out')
                    .style('left', '-200px');
            }
        });
    }

    return {
        template: '<div>{{leaderlist.name}} leaderlist</div>',
        link: linker,
        scope: {
            leaderlist: '='
        }
    };
});

angular.module('leaderboards').controller('LeaderboardController', function ($scope, $interval, api) {
    var current_leaderlist_index = 0;

    $scope.leaderlists = api.get.leaderlists();

    // deactivate everything but the first leaderlist
    $scope.leaderlists.forEach(function (leaderlist, index) {
        if (!index) {
            leaderlist.active = true;
            return;
        }

        leaderlist.active = false;
    });

    // and on a timer switch between all leaderlists
    $interval(function () {
        var len = $scope.leaderlists.length,
            to_activate = $scope.leaderlists[ ++current_leaderlist_index % len ];

        $scope.leaderlists.forEach(function (leaderlist) {
            if (to_activate.id === leaderlist.id) {
                return;
            }

            leaderlist.active = false;
        });

        to_activate.active = true;
    }, 2000);
});
