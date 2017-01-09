
	exports.defineAutoTests = function() {
        describe('Testing framework',function(){
            it('example test function',function(){
                expect(true).toBe(true);
            });

        });
        
        
        //------ AUTHENTICATE SDK-----------------
        
        /*function to grab the configuration JSON file from assets folder.
         *@assetPath: path with in the assets folder, with out any leading /
         *@successCallback will be called with the JSON config object, in case of success
         *@errorCallback will be called with error event, in case of error
         *
         *WARNING: this requires the cordova-plugin-file 4.1.0 "File" plugin.
         */
         function getJSONConfig(assetPath,successCallback,errorCallback)
         {
             var url = "file:///android_asset/"+assetPath;
             window.resolveLocalFileSystemURL(url,function (fileEntry){
             fileEntry.file(function(file){
                     var reader = new FileReader();
                     reader.onloadend = function(e) {
                         console.log(this.result);
                         successCallback(JSON.parse(this.result));
                     };
                     reader.readAsText(file);
                 },function(evt){
                     console.log(evt.code);
                     errorCallback(evt);
                 });

             },function(evt){
                 console.log(evt.code);
                 errorCallback(evt);
             });
         }
        
        describe('Authenticate SDK tests',function(){

            var return_data;
            beforeEach(function(done){
            getJSONConfig("msso_config.json",function(result){
                            var jsonObject=JSON.stringify(result);
                            L7SMssoSDKPlugin.authenticate("admin","7layer",successCallback,errorCallback);
                        },function(evt){
                            console.log("Error reading configuration "+evt.code);
                        });

            function successCallback(result){
                        return_data = result;
                        done();

                    }
            function errorCallback(result){
                return_data = result;
                done();
            }
            });

            it('Valid authentication',function(){
                                console.log("return_data:"+return_data+"_");
                                expect(return_data).toMatch("200");
             });

        });


         describe('Authenticate SDK tests',function(){

            var return_data;
            beforeEach(function(done){
            getJSONConfig("msso_config.json",function(result){
                            var jsonObject=JSON.stringify(result);
                            L7SMssoSDKPlugin.authenticate(" admin "," 7layer ",successCallback,errorCallback);
                        },function(evt){
                            console.log("Error reading configuration "+evt.code);
                        });

            function successCallback(result){
                        return_data = result;
                        done();

                    }
            function errorCallback(result){
                return_data = result;
                done();
            }
            });

            it('Valid authentication, with trimming input',function(){
                                console.log("return_data:"+return_data+"_");
                                expect(return_data).toMatch("200");
             });

        });

        describe('Authenticate SDK tests',function(){

            var return_data;
            beforeEach(function(done){
            getJSONConfig("msso_config.json",function(result){
                            var jsonObject=JSON.stringify(result);
                            L7SMssoSDKPlugin.authenticate("admin1","7layer1",successCallback,errorCallback);
                        },function(evt){
                            console.log("Error reading configuration "+evt.code);
                        });

            function successCallback(result){
                        return_data = result;
                        done();

                    }
            function errorCallback(result){
                return_data = result;
                done();
            }
            });

            it('Invalid credentials ',function(){
                          expect(return_data).not.toBe("200");
             });

        });

        describe('Authenticate SDK tests',function(){

            var return_data;
            beforeEach(function(done){
            getJSONConfig("msso_config.json",function(result){
                            var jsonObject=JSON.stringify(result);
                            L7SMssoSDKPlugin.authenticate("","7layer1",successCallback,errorCallback);
                        },function(evt){
                            console.log("Error reading configuration "+evt.code);
                        });

            function successCallback(result){
                        return_data = result;
                        done();

                    }
            function errorCallback(result){
                return_data = result;
                done();
            }
            });

            it('Empty username ',function(){
                          expect(return_data).toMatch("empty username");
             });

        });

        describe('Authenticate SDK tests',function(){

                var return_data;
                beforeEach(function(done){
                getJSONConfig("msso_config.json",function(result){
                                var jsonObject=JSON.stringify(result);
                                L7SMssoSDKPlugin.authenticate("admin","",successCallback,errorCallback);
                            },function(evt){
                                console.log("Error reading configuration "+evt.code);
                            });

                function successCallback(result){
                            return_data = result;
                            done();

                        }
                function errorCallback(result){
                    return_data = result;
                    done();
                }
                });

                it('Empty password ',function(){
                              expect(return_data).toMatch("empty password");
                 });

            });



        //------  END AUTHENTICATE SDK-----------------

        describe('Initialize SDK tests',function(){

            var wrongJson=null;
            var return_data;
            beforeEach(function(done){
                L7SMssoSDKPlugin.initialize(function(result){
                    return_data=result;
                    done();
                },function(result){
                return_data=result;
                done();
                },wrongJson);
            });

            it('Null json object to initialize SDK',function(){
                    console.log(return_data);
                    expect(return_data).not.toBe("success");
                    expect(return_data).toMatch("failure");
            });

        });

        describe('Initialize SDK tests',function(){

            var wrongJson='{"android":"somevalue"}';
            var return_data;
            beforeEach(function(done){
                L7SMssoSDKPlugin.initialize(function(result){
                    return_data=result;
                    done();
                },function(result){
                return_data=result;
                done();
                },wrongJson);
            });

            it('Wrong json object to initialize SDK',function(){
                    expect(return_data).not.toBe("success");
                    expect(return_data).toMatch("failure");
            });

        });


		describe('MAS Storage Tests',function(){
			var L7Obj;
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			beforeEach(function(done) {


				var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
                var modeOfStorage=false;
				var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
								'"ios":{ "key1":"value1","key2":"value2"} }';
				L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
				L7Obj.deleteAll(sfunc,efunc);
				var res=L7Obj.write(function(result){
					var result=JSON.parse(result);
					return_data=result.data;
					done();
					},function(result){
						var result=JSON.parse(result);
						var result_data=JSON.parse(result.data);
						return_data=result_data.code;
						done();
						},"key2","value2");

			});

			it('test instantiation operation',function(){
				expect(return_data).toBe("key2");
				expect(L7Obj).toBeDefined();
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});

		});

		describe('MAS Storage Tests',function(){
			var L7Obj;
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			beforeEach(function(done) {

				var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
                var modeOfStorage=false;
				var config='{ "android1":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
								'"ios":{ "key1":"value1","key2":"value2"} }';
				L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
				var res=L7Obj.write(function(result){
					var result=JSON.parse(result);
					return_data=result.data;
					done();
					},function(result){
						var result=JSON.parse(result);
						var result_data=JSON.parse(result.data);
						return_data=result_data.code;
						done();
						},"key2","value2");

			});

			it('test wrong input instantiation operation',function(){
				expect(return_data).toBe("-601");
				expect(L7Obj).toBeDefined();
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});

		});

		describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;
			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.read(function(result){

				var result=JSON.parse(result);
				return_data=result.data;
				done();
				},function(result){
					var result=JSON.parse(result);
					var result_data=JSON.parse(result.data);
					return_data=result_data.code;
					done();
					},"key1");

			});

			it('test read operation',function(){
				expect(return_data).toBe("value1");
			});

			afterEach(function() {
            	L7Obj.deleteAll(sfunc,efunc);
            });
		});

		describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;
			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.read(function(result){

				var result=JSON.parse(result);
				return_data=result.data;
				done();
				},function(result){
					var result=JSON.parse(result);
					var result_data=JSON.parse(result.data);
					return_data=result_data.code;
					done();
					},"key4");

			});

			it('test read operation with wrong key',function(){
				expect(return_data).toBe("105");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
		});

		describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key1","value1");

			});

			it('test write operation',function(){
				expect(return_data).toBe("key1");
			});

			afterEach(function() {
            	L7Obj.deleteAll(sfunc,efunc);
            });
		});

		describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);

			var res=L7Obj.write(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key1","value1");

			});

			it('test write followed by write(on the same key/value) operation',function(){
				expect(return_data).toBe("key1");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
		});

		describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.update(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key1","value2");

			});

			it('test update function',function(){
				expect(return_data).toBe("key1");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
        });

        describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.update(sfunc,efunc,"key1","value2");
			var res=L7Obj.read(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key1");

			});

			it('test update and then read operation',function(){
				expect(return_data).toBe("value2");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
        });

		describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.writeOrUpdate(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key2","value2");

			});

			it('test writeOrUpdate with a fresh write operation',function(){
				expect(return_data).toBe("key2");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
        });

        describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.writeOrUpdate(sfunc,efunc,"key1","value1");
			var res=L7Obj.read(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key1");

			});

			it('test writeOrUpdate with a fresh write followed by read operation',function(){
				expect(return_data).toBe("value1");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
        });

         describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.writeOrUpdate(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key1","value2");

			});

			it('test writeOrUpdate with an update operation',function(){
				expect(return_data).toBe("key1");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
         });

		 describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.writeOrUpdate(sfunc,efunc,"key1","value2");
			var res=L7Obj.read(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key1");

			});

			it('test writeOrUpdate with an update followed by read operation',function(){
				expect(return_data).toBe("value2");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
		  });

		 describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.delete(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key1");

			});

			it('test delete operation',function(){
				expect(return_data).toBe("key1");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
		 });

		 describe('MAS Storage Tests',function(){
			var return_data;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.delete(sfunc,efunc,"key1");
			var res=L7Obj.read(function(result){
			var result=JSON.parse(result);
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key1");

			});

			it('test delete followed by read operation',function(){
				expect(return_data).toBe("105");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
		 });

		 describe('MAS Storage Tests',function(){
			var return_data;
			var return_status;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.write(sfunc,efunc,"key2","value2");
			var res=L7Obj.write(sfunc,efunc,"key3","value3");
			var res=L7Obj.write(sfunc,efunc,"key4","value4");
			var res=L7Obj.deleteAll(function(result){
			var result=JSON.parse(result);
			return_status=result.status;
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				return_status=result.status;
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				});

			});

			it('test deleteAll operation',function(){
				expect(return_status).toBe("SUCCESS");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
		 });

		 describe('MAS Storage Tests',function(){
			var return_data;
			var return_status;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.write(sfunc,efunc,"key2","value2");
			var res=L7Obj.write(sfunc,efunc,"key3","value3");
			var res=L7Obj.write(sfunc,efunc,"key4","value4");
			var res=L7Obj.deleteAll(sfunc,efunc);
			var res=L7Obj.read(function(result){
			var result=JSON.parse(result);
			return_status=result.status;
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				return_status=result.status;
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				},"key2");

			});

			it('test deleteAll followed by read operation',function(){
				expect(return_status).toBe("FAILURE");
				expect(return_data).toBe("105");
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
		 });

		 describe('MAS Storage Tests',function(){
			var return_data;
			var return_status;
			var sfunc=function(result){};
			var efunc=function(result){};
			var L7Obj;

			beforeEach(function(done) {
			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
			var modeOfStorage=false;
			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
							'"ios":{ "key1":"value1","key2":"value2"} }';

			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
			var res=L7Obj.write(sfunc,efunc,"key1","value1");
			var res=L7Obj.write(sfunc,efunc,"key2","value2");
			var res=L7Obj.write(sfunc,efunc,"key3","value3");
			var res=L7Obj.write(sfunc,efunc,"key4","value4");
			var res=L7Obj.getAllKeys(function(result){
			var result=JSON.parse(result);
			return_status=result.status;
			return_data=result.data;
			done();
			},function(result){
				var result=JSON.parse(result);
				return_status=result.status;
				var result_data=JSON.parse(result.data);
				return_data=result_data.code;
				done();
				});

			});

			it('test getAllKeys',function(){
				expect(return_status).toBe("SUCCESS");
				expect(return_data).toContain('key1');
				expect(return_data).toContain('key2');
				expect(return_data).toContain('key3');
				expect(return_data).toContain('key4');
			});

			afterEach(function() {
				L7Obj.deleteAll(sfunc,efunc);
			});
		 });

		 //------ SHARED MODE -----------------

		 describe('MAS Storage Tests',function(){
         			var L7Obj;
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			beforeEach(function(done) {

         				var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         				var modeOfStorage=true;
         				var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         								'"ios":{ "key1":"value1","key2":"value2"} }';
         				L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         				var res=L7Obj.write(function(result){
         					var result=JSON.parse(result);
         					return_data=result.data;
         					done();
         					},function(result){
         						var result=JSON.parse(result);
         						var result_data=JSON.parse(result.data);
         						return_data=result_data.code;
         						done();
         						},"key2","value2");

         			});

         			it('test instantiation operation-SHARED MODE',function(){
         				expect(return_data).toBe("key2");
         				expect(L7Obj).toBeDefined();
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});

         		});

         		describe('MAS Storage Tests',function(){
         			var L7Obj;
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			beforeEach(function(done) {

         				var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         				var modeOfStorage=true;
         				var config='{ "android1":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         								'"ios":{ "key1":"value1","key2":"value2"} }';
         				L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         				var res=L7Obj.write(function(result){
         					var result=JSON.parse(result);
         					return_data=result.data;
         					done();
         					},function(result){
         						var result=JSON.parse(result);
         						var result_data=JSON.parse(result.data);
         						return_data=result_data.code;
         						done();
         						},"key2","value2");

         			});

         			it('test wrong input instantiation operation-SHARED MODE',function(){
         				expect(return_data).toBe("-601");
         				expect(L7Obj).toBeDefined();
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});

         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;
         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.read(function(result){

         				var result=JSON.parse(result);
         				return_data=result.data;
         				done();
         				},function(result){
         					var result=JSON.parse(result);
         					var result_data=JSON.parse(result.data);
         					return_data=result_data.code;
         					done();
         					},"key1");

         			});

         			it('test read operation-SHARED MODE',function(){
         				expect(return_data).toBe("value1");
         			});

         			afterEach(function() {
                     	L7Obj.deleteAll(sfunc,efunc);
                     });
         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;
         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.read(function(result){

         				var result=JSON.parse(result);
         				return_data=result.data;
         				done();
         				},function(result){
         					var result=JSON.parse(result);
         					var result_data=JSON.parse(result.data);
         					return_data=result_data.code;
         					done();
         					},"key4");

         			});

         			it('test read operation with wrong key-SHARED MODE',function(){
         				expect(return_data).toBe("105");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1","value1");

         			});

         			it('test write operation-SHARED MODE',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
                     	L7Obj.deleteAll(sfunc,efunc);
                     });
         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);

         			var res=L7Obj.write(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1","value1");

         			});

         			it('test write followed by write(on the same key/value) operation-SHARED MODE',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.update(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1","value2");

         			});

         			it('test update function-SHARED MODE',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                 });

                 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.update(sfunc,efunc,"key1","value2");
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test update and then read operation-SHARED MODE',function(){
         				expect(return_data).toBe("value2");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                 });

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.writeOrUpdate(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key2","value2");

         			});

         			it('test writeOrUpdate with a fresh write operation-SHARED MODE',function(){
         				expect(return_data).toBe("key2");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                 });

                 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.writeOrUpdate(sfunc,efunc,"key1","value1");
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test writeOrUpdate with a fresh write followed by read operation-SHARED MODE',function(){
         				expect(return_data).toBe("value1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                 });

                  describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.writeOrUpdate(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1","value2");

         			});

         			it('test writeOrUpdate with an update operation-SHARED MODE',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                  });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.writeOrUpdate(sfunc,efunc,"key1","value2");
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test writeOrUpdate with an update followed by read operation-SHARED MODE',function(){
         				expect(return_data).toBe("value2");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		  });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.delete(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test delete operation-SHARED MODE',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.delete(sfunc,efunc,"key1");
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test delete followed by read operation-SHARED MODE',function(){
         				expect(return_data).toBe("105");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var return_status;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.write(sfunc,efunc,"key2","value2");
         			var res=L7Obj.write(sfunc,efunc,"key3","value3");
         			var res=L7Obj.write(sfunc,efunc,"key4","value4");
         			var res=L7Obj.deleteAll(function(result){
         			var result=JSON.parse(result);
         			return_status=result.status;
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				return_status=result.status;
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				});

         			});

         			it('test deleteAll operation-SHARED MODE',function(){
         				expect(return_status).toBe("SUCCESS");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var return_status;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.write(sfunc,efunc,"key2","value2");
         			var res=L7Obj.write(sfunc,efunc,"key3","value3");
         			var res=L7Obj.write(sfunc,efunc,"key4","value4");
         			var res=L7Obj.deleteAll(sfunc,efunc);
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_status=result.status;
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				return_status=result.status;
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key2");

         			});

         			it('test deleteAll followed by read operation-SHARED MODE',function(){
         				expect(return_status).toBe("FAILURE");
         				expect(return_data).toBe("105");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var return_status;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.KeyStoreStorage';
         			var modeOfStorage=true;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.write(sfunc,efunc,"key2","value2");
         			var res=L7Obj.write(sfunc,efunc,"key3","value3");
         			var res=L7Obj.write(sfunc,efunc,"key4","value4");
         			var res=L7Obj.getAllKeys(function(result){
         			var result=JSON.parse(result);
         			return_status=result.status;
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				return_status=result.status;
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				});

         			});

         			it('test getAllKeys-SHARED MODE',function(){
         				expect(return_status).toBe("SUCCESS");
						expect(return_data).toContain('key1');
						expect(return_data).toContain('key2');
						expect(return_data).toContain('key3');
						expect(return_data).toContain('key4');
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

		 //-----END OF SHARED MODE -------------

		 //----- START OF ELS PRIVATE ------------------

		 describe('MAS Storage Tests',function(){
         			var L7Obj;
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			beforeEach(function(done) {

         				var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         				var modeOfStorage=false;
         				var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         								'"ios":{ "key1":"value1","key2":"value2"} }';
         				L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         				var res=L7Obj.write(function(result){
         					var result=JSON.parse(result);
         					return_data=result.data;
         					done();
         					},function(result){
         						var result=JSON.parse(result);
         						var result_data=JSON.parse(result.data);
         						return_data=result_data.code;
         						done();
         						},"key2","value2");

         			});

         			it('test instantiation operation-ELS STORAGE',function(){
         				expect(return_data).toBe("key2");
         				expect(L7Obj).toBeDefined();
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});

         		});

         		describe('MAS Storage Tests',function(){
         			var L7Obj;
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			beforeEach(function(done) {

         				var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         				var modeOfStorage=false;
         				var config='{ "android1":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         								'"ios":{ "key1":"value1","key2":"value2"} }';
         				L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         				var res=L7Obj.write(function(result){
         					var result=JSON.parse(result);
         					return_data=result.data;
         					done();
         					},function(result){
         						var result=JSON.parse(result);
         						var result_data=JSON.parse(result.data);
         						return_data=result_data.code;
         						done();
         						},"key2","value2");

         			});

         			it('test wrong input instantiation operation-ELS STORAGE',function(){
         				expect(return_data).toBe("-601");
         				expect(L7Obj).toBeDefined();
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});

         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;
         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.read(function(result){

         				var result=JSON.parse(result);
         				return_data=result.data;
         				done();
         				},function(result){
         					var result=JSON.parse(result);
         					var result_data=JSON.parse(result.data);
         					return_data=result_data.code;
         					done();
         					},"key1");

         			});

         			it('test read operation-ELS STORAGE',function(){
         				expect(return_data).toBe("value1");
         			});

         			afterEach(function() {
                     	L7Obj.deleteAll(sfunc,efunc);
                     });
         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;
         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.read(function(result){

         				var result=JSON.parse(result);

         				return_data=result.data;
         				done();
         				},function(result){
         					var result=JSON.parse(result);

         					var result_data=JSON.parse(result.data);

         					return_data=result_data.code;
         					done();
         					},"key4");

         			});

         			it('test read operation with wrong key-ELS STORAGE',function(){
         				expect(return_data).toBe("105");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1","value1");

         			});

         			it('test write operation',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
                     	L7Obj.deleteAll(sfunc,efunc);
                     });
         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);

         			var res=L7Obj.write(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1","value1");

         			});

         			it('test write followed by write(on the same key/value) operation-ELS STORAGE',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		});

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.update(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1","value2");

         			});

         			it('test update function-ELS STORAGE',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                 });

                 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.update(sfunc,efunc,"key1","value2");
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test update and then read operation-ELS STORAGE',function(){
         				expect(return_data).toBe("value2");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                 });

         		describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.writeOrUpdate(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key2","value2");

         			});

         			it('test writeOrUpdate with a fresh write operation-ELS STORAGE',function(){
         				expect(return_data).toBe("key2");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                 });

                 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.writeOrUpdate(sfunc,efunc,"key1","value1");
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test writeOrUpdate with a fresh write followed by read operation-ELS STORAGE',function(){
         				expect(return_data).toBe("value1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                 });

                  describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.writeOrUpdate(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1","value2");

         			});

         			it('test writeOrUpdate with an update operation-ELS STORAGE',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
                  });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.writeOrUpdate(sfunc,efunc,"key1","value2");
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test writeOrUpdate with an update followed by read operation-ELS STORAGE',function(){
         				expect(return_data).toBe("value2");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		  });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.delete(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test delete operation-ELS STORAGE',function(){
         				expect(return_data).toBe("key1");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.delete(sfunc,efunc,"key1");
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key1");

         			});

         			it('test delete followed by read operation-ELS STORAGE',function(){
         				expect(return_data).toBe("105");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var return_status;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.write(sfunc,efunc,"key2","value2");
         			var res=L7Obj.write(sfunc,efunc,"key3","value3");
         			var res=L7Obj.write(sfunc,efunc,"key4","value4");
         			var res=L7Obj.deleteAll(function(result){
         			var result=JSON.parse(result);
         			return_status=result.status;
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				return_status=result.status;
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				});

         			});

         			it('test deleteAll operation-ELS STORAGE',function(){
         				expect(return_status).toBe("SUCCESS");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var return_status;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.write(sfunc,efunc,"key2","value2");
         			var res=L7Obj.write(sfunc,efunc,"key3","value3");
         			var res=L7Obj.write(sfunc,efunc,"key4","value4");
         			var res=L7Obj.deleteAll(sfunc,efunc);
         			var res=L7Obj.read(function(result){
         			var result=JSON.parse(result);
         			return_status=result.status;
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				return_status=result.status;
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				},"key2");

         			});

         			it('test deleteAll followed by read operation-ELS STORAGE',function(){
         				expect(return_status).toBe("FAILURE");
         				expect(return_data).toBe("105");
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

         		 describe('MAS Storage Tests',function(){
         			var return_data;
         			var return_status;
         			var sfunc=function(result){};
         			var efunc=function(result){};
         			var L7Obj;

         			beforeEach(function(done) {
         			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
         			var modeOfStorage=false;
         			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
         							'"ios":{ "key1":"value1","key2":"value2"} }';

         			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
         			var res=L7Obj.write(sfunc,efunc,"key1","value1");
         			var res=L7Obj.write(sfunc,efunc,"key2","value2");
         			var res=L7Obj.write(sfunc,efunc,"key3","value3");
         			var res=L7Obj.write(sfunc,efunc,"key4","value4");
         			var res=L7Obj.getAllKeys(function(result){
         			var result=JSON.parse(result);
         			return_status=result.status;
         			return_data=result.data;
         			done();
         			},function(result){
         				var result=JSON.parse(result);
         				return_status=result.status;
         				var result_data=JSON.parse(result.data);
         				return_data=result_data.code;
         				done();
         				});

         			});

         			it('test getAllKeys-ELS STORAGE',function(){
         				expect(return_status).toBe("SUCCESS");
						expect(return_data).toContain('key1');
						expect(return_data).toContain('key2');
						expect(return_data).toContain('key3');
						expect(return_data).toContain('key4');
         			});

         			afterEach(function() {
         				L7Obj.deleteAll(sfunc,efunc);
         			});
         		 });

		 //---------END OF ELS PRIVATE------------------

		 //--------START OF ELS SHARED ----------------

		  describe('MAS Storage Tests',function(){
                  			var L7Obj;
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			beforeEach(function(done) {

                  				var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  				var modeOfStorage=true;
                  				var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  								'"ios":{ "key1":"value1","key2":"value2"} }';
                  				L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  				var res=L7Obj.write(function(result){
                  					var result=JSON.parse(result);
                  					return_data=result.data;
                  					done();
                  					},function(result){
                  						var result=JSON.parse(result);
                  						var result_data=JSON.parse(result.data);
                  						return_data=result_data.code;
                  						done();
                  						},"key2","value2");

                  			});

                  			it('test instantiation operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("key2");
                  				expect(L7Obj).toBeDefined();
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});

                  		});

                  		describe('MAS Storage Tests',function(){
                  			var L7Obj;
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			beforeEach(function(done) {

                  				var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  				var modeOfStorage=true;
                  				var config='{ "android1":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  								'"ios":{ "key1":"value1","key2":"value2"} }';
                  				L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  				var res=L7Obj.write(function(result){
                  					var result=JSON.parse(result);
                  					return_data=result.data;
                  					done();
                  					},function(result){
                  						var result=JSON.parse(result);
                  						var result_data=JSON.parse(result.data);
                  						return_data=result_data.code;
                  						done();
                  						},"key2","value2");

                  			});

                  			it('test wrong input instantiation operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("-601");
                  				expect(L7Obj).toBeDefined();
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});

                  		});

                  		describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;
                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.read(function(result){

                  				var result=JSON.parse(result);

                  				return_data=result.data;
                  				done();
                  				},function(result){
                  					var result=JSON.parse(result);

                  					var result_data=JSON.parse(result.data);

                  					return_data=result_data.code;
                  					done();
                  					},"key1");

                  			});

                  			it('test read operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("value1");
                  			});

                  			afterEach(function() {
                              	L7Obj.deleteAll(sfunc,efunc);
                              });
                  		});

                  		describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;
                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.read(function(result){

                  				var result=JSON.parse(result);

                  				return_data=result.data;
                  				done();
                  				},function(result){
                  					var result=JSON.parse(result);

                  					var result_data=JSON.parse(result.data);

                  					return_data=result_data.code;
                  					done();
                  					},"key4");

                  			});

                  			it('test read operation with wrong key-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("105");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                  		});

                  		describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key1","value1");

                  			});

                  			it('test write operation-SHARED MODE',function(){
                  				expect(return_data).toBe("key1");
                  			});

                  			afterEach(function() {
                              	L7Obj.deleteAll(sfunc,efunc);
                              });
                  		});

                  		describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);

                  			var res=L7Obj.write(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key1","value1");

                  			});

                  			it('test write followed by write(on the same key/value) operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("key1");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                  		});

                  		describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.update(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key1","value2");

                  			});

                  			it('test update function-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("key1");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                          });

                          describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.update(sfunc,efunc,"key1","value2");
                  			var res=L7Obj.read(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key1");

                  			});

                  			it('test update and then read operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("value2");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                          });

                  		describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.writeOrUpdate(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key2","value2");

                  			});

                  			it('test writeOrUpdate with a fresh write operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("key2");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                          });

                          describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.writeOrUpdate(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.read(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key1");

                  			});

                  			it('test writeOrUpdate with a fresh write followed by read operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("value1");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                          });

                           describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.writeOrUpdate(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key1","value2");

                  			});

                  			it('test writeOrUpdate with an update operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("key1");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                           });

                  		 describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.writeOrUpdate(sfunc,efunc,"key1","value2");
                  			var res=L7Obj.read(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key1");

                  			});

                  			it('test writeOrUpdate with an update followed by read operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("value2");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                  		  });

                  		 describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.delete(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key1");

                  			});

                  			it('test delete operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("key1");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                  		 });

                  		 describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.delete(sfunc,efunc,"key1");
                  			var res=L7Obj.read(function(result){
                  			var result=JSON.parse(result);
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key1");

                  			});

                  			it('test delete followed by read operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_data).toBe("105");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                  		 });

                  		 describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var return_status;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.write(sfunc,efunc,"key2","value2");
                  			var res=L7Obj.write(sfunc,efunc,"key3","value3");
                  			var res=L7Obj.write(sfunc,efunc,"key4","value4");
                  			var res=L7Obj.deleteAll(function(result){
                  			var result=JSON.parse(result);
                  			return_status=result.status;
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				return_status=result.status;
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				});

                  			});

                  			it('test deleteAll operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_status).toBe("SUCCESS");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                  		 });

                  		 describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var return_status;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.write(sfunc,efunc,"key2","value2");
                  			var res=L7Obj.write(sfunc,efunc,"key3","value3");
                  			var res=L7Obj.write(sfunc,efunc,"key4","value4");
                  			var res=L7Obj.deleteAll(sfunc,efunc);
                  			var res=L7Obj.read(function(result){
                  			var result=JSON.parse(result);
                  			return_status=result.status;
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				return_status=result.status;
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				},"key2");

                  			});

                  			it('test deleteAll followed by read operation-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_status).toBe("FAILURE");
                  				expect(return_data).toBe("105");
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                  		 });

                  		 describe('MAS Storage Tests',function(){
                  			var return_data;
                  			var return_status;
                  			var sfunc=function(result){};
                  			var efunc=function(result){};
                  			var L7Obj;

                  			beforeEach(function(done) {
                  			var typeOfStorage='com.ca.mas.core.storage.implementation.EncryptedLocalStorage';
                  			var modeOfStorage=true;
                  			var config='{ "android":{ "type":"'+typeOfStorage+'", "mode":"'+modeOfStorage+'" },'+
                  							'"ios":{ "key1":"value1","key2":"value2"} }';

                  			L7Obj=new L7SMssoSDKPlugin.MASStorage(config);
                  			var res=L7Obj.write(sfunc,efunc,"key1","value1");
                  			var res=L7Obj.write(sfunc,efunc,"key2","value2");
                  			var res=L7Obj.write(sfunc,efunc,"key3","value3");
                  			var res=L7Obj.write(sfunc,efunc,"key4","value4");
                  			var res=L7Obj.getAllKeys(function(result){
                  			var result=JSON.parse(result);
                  			return_status=result.status;
                  			return_data=result.data;
                  			done();
                  			},function(result){
                  				var result=JSON.parse(result);
                  				return_status=result.status;
                  				var result_data=JSON.parse(result.data);
                  				return_data=result_data.code;
                  				done();
                  				});

                  			});

                  			it('test getAllKeys-ELS STORAGE-SHARED MODE',function(){
                  				expect(return_status).toBe("SUCCESS");
								expect(return_data).toContain('key1');
								expect(return_data).toContain('key2');
								expect(return_data).toContain('key3');
								expect(return_data).toContain('key4');
                  			});

                  			afterEach(function() {
                  				L7Obj.deleteAll(sfunc,efunc);
                  			});
                  		 });


		 //---------- END OF ELS SHARED -----------------

	};



