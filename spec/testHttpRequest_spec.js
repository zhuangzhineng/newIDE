import HttpRequest from '../js/HttpRequest'

describe("test httpRequest",function () {
	
	let callback;
	beforeEach(()=>{
		callback = jasmine.createSpy();
	});
	afterEach(()=>{
		expect(callback).toHaveBeenCalled();
	})

	it("test ajax get 2 param return success",()=>{
		spyOn($,"ajax").and.callFake((url,option)=>{
			option.success();
		})
		HttpRequest.get("http://getURL",{
			success:callback,
			error:()=>fail("GET Request Fail")
		})
	});


	it("test ajax post 2 param return success",()=>{
		spyOn($,"ajax").and.callFake((url,option)=>{
			option.success();
		})
		HttpRequest.post("http://postURL",{
			success:callback,
			error:()=>fail("POST Request Fail")
		})
	});

});