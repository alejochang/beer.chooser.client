'use strict';
 
describe('Unit: Testing Services', function(){
   
    beforeEach(angular.mock.module('mainApp'));
    
    it('should contain an BeerChooserService',
    	    inject(function(BeerChooserService) {
    	    expect(BeerChooserService).not.toBeNull();
    }));
});