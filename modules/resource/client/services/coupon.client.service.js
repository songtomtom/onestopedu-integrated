(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.services')
    .factory('Coupon', Coupon);

  /**
   * Dependency Injection
   */
  Coupon.$inject = ['$resource'];

  /**
   * Coupon resource service for REST end coupon
   */
  function Coupon($resource) {
    const service = $resource('/api/coupon/:couponId', {
      couponId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      generate: {
        method: 'POST',
        url: '/api/coupon',
        isArray: true
      },
      save: {
        method: 'GET',
        url: '/api/coupon/:couponId/member/:memberId',
        params: {
          couponId: '=',
          memberId: '='
        }
      },
      remove: {
        method: 'DELETE',
        url: '/api/coupon/:couponId/member/:memberId',
        params: {
          couponId: '=',
          memberId: '='
        }
      },
      delete: {
        method: 'DELETE',
        url: '/api/coupon/:couponId',
        params: {
          couponId: '='
        }
      },
      listByGroupId: {
        method: 'GET',
        url: '/api/coupon/group/:groupId',
        isArray: true,
        params: {
          groupId: '='
        }
      },
      listByMemberId: {
        method: 'GET',
        url: '/api/coupon/member/:memberId',
        isArray: true,
        params: {
          memberId: '='
        }
      },
      readByCode: {
        method: 'GET',
        url: '/api/coupon/code/:code',
        params: {
          code: '='
        }
      }
    });

    angular.extend(service, {
      addCoupon,
      findByGroupId,
      findByMemberId,
      findOne,
      findOneByCode,
      generateCoupon,
      removeCoupon
    });

    return service;

    /**
     * Find coupon
     */
    function findOne(couponId) {
      return this.get({
        couponId
      }).$promise;
    }

    /**
     * Find coupon list by group id
     */
    function findByGroupId(groupId) {
      return this.listByGroupId({
        groupId
      }).$promise;
    }

    /**
     * Find member by list
     */
    function findByMemberId(memberId) {
      return this.listByMemberId({
        memberId
      }).$promise;
    }

    /**
     * Generate coupon
     */
    function generateCoupon(coupon) {
      return this.generate(coupon)
        .$promise;
    }

    /**
     * Find one by coupon code
     */
    function findOneByCode(code) {
      return this.readByCode({
        code
      }).$promise;
    }

    /**
     * Coupon add to member
     */
    function addCoupon(couponId, memberId) {
      return this.save({
        couponId,
        memberId
      }).$promise;
    }

    /**
     * Coupon remove or delete
     */
    function removeCoupon(couponId, memberId) {
      if (couponId && memberId) {
        return this.remove({
          couponId,
          memberId
        }).$promise;
      } else {
        return this.delete({
          couponId
        }).$promise;
      }
    }
  }
}());
