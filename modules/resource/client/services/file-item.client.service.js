(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.services')
    .factory('FileItem', FileItem);

  /**
   * Dependency Injection
   */
  FileItem.$inject = ['$resource'];

  /**
   * File resource service for REST end file
   */
  function FileItem($resource) {
    const service = $resource('/api/file-item/:fileItemId', {
      fileItemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      download: {
        method: 'GET',
        url: '/api/file-item/download/:fileItemId',
        params: {
          fileItemId: '='
        }
      }
    });

    angular.extend(service, {
      findOne,
      saveFileItem,
      downloadFileItem
    });

    return service;

    /**
     * Find file item
     */
    function findOne(fileItemId) {
      return this.get({
        fileItemId
      }).$promise;
    }

    /**
     * Save uploaded file item information
     */
    function saveFileItem(fileItem) {
      return this.save(fileItem)
        .$promise;
    }

    /**
     * Download
     */
    function downloadFileItem(fileItemId) {
      return this.download({
        fileItemId
      }).$promise;
    }
  }
}());
