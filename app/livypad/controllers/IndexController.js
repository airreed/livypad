livypad.controller("IndexController", function($scope,supersonic){

//Initialize Parse with Javascript Key
	supersonic.ui.tabs.update([{title: "Home", badge: "1"}]);
	 	 
	Parse.initialize("1NREN2oBv02mpf2qMWSJMDdjxrlAFXklHLhMvaWo", "2pG9AFjrxmusIhuWDZcjUSsG8Rp4DueWQQNOVE1a");
	
	//classes
	
	var ScheduledAppointment = Parse.Object.extend("ScheduledAppointments");
	var SuggestedAppointment = Parse.Object.extend("SuggestedAppointments");
	var FamilyMember = Parse.Object.extend("FamilyMember");
	var Doctor = Parse.Object.extend("Doctor");

	//get the the parameter pased by previous page
	supersonic.ui.views.current.params.onValue(function(values){
		$scope.previewId = values.id;
	})

	//Example Queries

	//var queryScheduledAppointments = new Parse.Query(ScheduledAppointment);
	//var querySuggestedAppointments = new Parse.Query(SuggestedAppointment);
	//var queryFamilyMember = new Parse.Query(FamilyMember);

	//Refresh functionality

	$scope.refresh = function(){
		location.reload();
	}

	// Preliminary Log in Functionality, mostly for testing

		
	var currentUser = Parse.User.current();


	$scope.thisUser = [];

	$scope.thisUser.push({ 	userName: currentUser.get("username"), 
							Email: currentUser.get("email"), 
							thispassword: currentUser.get("password")
						});
	$scope.thisuser = $scope.thisUser[0];

	$scope.editThisUser = function(){
		var queryEditUser = new Parse.Query(Parse.User);
        queryEditUser.get(currentUser.id, {
          success: function(userAgain) {
            userAgain.set("username", $scope.editUser.username);
            userAgain.set("password", $scope.editUser.password);
			userAgain.set("email", $scope.editUser.email);
			currentUser = Parse.User.current();
			$scope.thisUser.push({ 	userName: currentUser.get("username"), 
									Email: currentUser.get("email"), 
									thispassword: currentUser.get("password")
								});
			$scope.thisuser = $scope.thisUser[0];
			alert(" Successfully updated your profile! "+ userAgain.get("username")+"\n Restart the app to view your new profile!");
            userAgain.save(null, {
              error: function(userAgain, error) {
                // This will error, since the Parse.User is not authenticated
              }
            });
            }
        });
	}

	// Remove Family Member function
	$scope.deleteFamilyMember = function(memberID){
		
		var queryDeleteMember = new Parse.Query(FamilyMember);
		var allFamilyMemberRelations = currentUser.relation("familyMember");
		queryDeleteMember.get(memberID, {
			success: function(memberDelete){
				allFamilyMemberRelations.remove(memberDelete);
				currentUser.save();
				memberDelete.destroy({
					success: function(myObject){
						var options = {
							message: "This family member has been removed from your family.",
							buttonLable: "Close"
						};
						supersonic.ui.dialog.alert("Success!", options).then(function() {
						  supersonic.logger.log("Alert closed.");
						});
					},
					error: function(myObject, error){
						var options = {
							message: "This member could not be removed from you family.",
							buttonLable: "Close"
						};
						supersonic.ui.dialog.alert("Issue Encountered", options).then(function() {
						  supersonic.logger.log("Alert closed.");
						});
					}
				});
			},
			error: function(memberDelete, error){

			}
		});
	}

	// Redundant Code to be deleted???? /////////////////
	/*
	$scope.members = [];
	$scope.allScheduledApps = [];
	
	function loadFamilyMember(){
		var allFamilyMemberRelations = currentUser.relation("familyMember");
  		allFamilyMemberRelations.query().find().then(function(familyMemberResults){
  			familyMemberResults.forEach(function(famMember){
  				$scope.members.push({ id: famMember.id,
									  name: famMember.get("Name"),
									  icon: famMember.get("iconID"),
									  dateOfBirth: new Date(famMember.get("dateOfBirth")),
									  gender: famMember.get("gender"),
									});
				var scheduled = famMember.relation("scheduledAppointments");
				scheduled.query().find().then(function(scheduledResults){
					for (i = 0; i < scheduledResults.length; i++) {
						$scope.allScheduledApps.push({name: famMember.get("Name"), 
													  results: scheduledResults[i]});
					}
				});
  			});
  			//alert($scope.members.length);
  		});
	};
	loadFamilyMember();*/

	// Query all the icons
	$scope.icons = [];
	$scope.icons.push({ url: "https://raw.githubusercontent.com/eecs394-spr15/livypad/master/app/livypad/images/Dad.png",
						name: "dad"});
	$scope.icons.push({	url: "https://raw.githubusercontent.com/eecs394-spr15/livypad/master/app/livypad/images/Boy.png",
						name: "boy"
						});
	$scope.icons.push({	url: src="https://raw.githubusercontent.com/eecs394-spr15/livypad/master/app/livypad/images/Mom.png",
						name: "mom"});
	$scope.icons.push({	url: "https://raw.githubusercontent.com/eecs394-spr15/livypad/master/app/livypad/images/Girl.png",
						name: "girl_1"});
	$scope.icons.push({	url: "https://raw.githubusercontent.com/eecs394-spr15/livypad/master/app/livypad/images/Girl2.png",
						name: "girl_2"});
	$scope.icons.push({	url: "https://raw.githubusercontent.com/eecs394-spr15/livypad/master/app/livypad/images/Grandma.png",
						name: "grandma"});
	$scope.icons.push({ url: "https://raw.githubusercontent.com/eecs394-spr15/livypad/master/app/livypad/images/Dog.png",
						name: "dog"});

	$scope.urlPass = ""
	$scope.getIconTitle = function(url){
		alert("Icon selected! Click Add Member to save.");
		$scope.urlPass = url;
		
	}
	
	// Preliminary Add Family Member function

	function addFamilyRelation(name, dateOfBirth, gender){
		var familyRelations = currentUser.relation("familyMember");
		var familyMember = new FamilyMember();

		familyMember.set("Name", name);
		familyMember.set("dateOfBirth", dateOfBirth);
		familyMember.set("gender", gender);
		familyMember.save();

	    familyRelations.add(familyMember);
	    currentUser.save();
	}

	
	//Add a family member
	$scope.addFamilyMember = function(){
		var familyRelations = currentUser.relation("familyMember");
		var familyMember = new FamilyMember();
		familyMember.set("Name", $scope.newMember.name);
		//var validDate = ($scope.newMember.dateOfBirth | date: "yyyy-MM-dd")
		familyMember.set("dateOfBirth", $scope.newMember.birthdate);
		familyMember.set("gender", $scope.newMember.gender);
		familyMember.set("iconID", $scope.urlPass);
		familyMember.set("ignoredAppointments", []);

		familyMember.save().then(function(familyMember) {
				familyRelations.add(familyMember);
	    		currentUser.save();
				var options = {
				  message: "Member has been added to your family",
				  buttonLabel: "Close"
				};

				supersonic.ui.dialog.alert("Success!", options).then(function() {
				  supersonic.logger.log("Alert closed.");
				});
				supersonic.ui.layers.pop();
					
				}, function(error) {
					alert("Member save failed");
				// the save failed.
				});

	};
	

	//Add a past scheduled event
	$scope.addScheduled = function(){
		var queryMember = new Parse.Query(FamilyMember);
		queryMember.get($scope.previewId, {
		  success: function(familyMember) {
		    var memberScheduledAppointmentsRelation = familyMember.relation("scheduledAppointments");
		   	var newScheduled = new ScheduledAppointment();
		   	newScheduled.set("name", $scope.newScheduled.name);
		   	newScheduled.set("doctor", $scope.newScheduled.doctor);
		   	newScheduled.set("location", $scope.newScheduled.location);
		   	newScheduled.set("dateScheduled", $scope.newScheduled.dateScheduled);
		   	var newScheduledFamMember = newScheduled.relation("familyMember");
		   	newScheduledFamMember.add(familyMember);
		   	newScheduled.save().then(function(newOne) {
				memberScheduledAppointmentsRelation.add(newOne);
	    		familyMember.save();

				var options = {
				  message: "Event has been added",
				  buttonLabel: "Close"
				};

				supersonic.ui.dialog.alert("Success!", options).then(function() {
				  supersonic.logger.log("Alert closed.");
				});
				supersonic.ui.layers.pop();
					
				}, function(error) {
					alert("Event save failed");
				// the save failed.
				});
		  },
		  error: function(object, error) {
		  	alert("could not add family member");
		  }
		});
	}

	//Add a doctor to particular family member
	$scope.addDoctor = function(){
		var queryMember = new Parse.Query(FamilyMember);
		queryMember.get($scope.previewId, {
		  success: function(familyMember) {
		    var memberDoctorsRelation = familyMember.relation("doctors");
		   	var newDoctor = new Doctor();
		   	newDoctor.set("name", $scope.newDoctor.name);
		   	newDoctor.set("type", $scope.newDoctor.type);
		   	newDoctor.save().then(function(newOne) {
				memberDoctorsRelation.add(newOne);
	    		familyMember.save();

				var options = {
				  message: "Doctor has been added",
				  buttonLabel: "Close"
				};

				supersonic.ui.dialog.alert("Success!", options).then(function() {
				  supersonic.logger.log("Alert closed.");
				});
				supersonic.ui.layers.pop();
					
				}, function(error) {
					alert("Doctor save failed");
				// the save failed.
				});
		  },
		  error: function(object, error) {
		  	alert("could not add family member");
		  }
		});
	}

	//LOADING scheduled and suggested appointments DATA FOR WHOLE FAMILY....On Initial load///////////////////////////////////////////////


	$scope.suggestedAppointmentList = [];
	$scope.allScheduledAppointmentList = [];
	$scope.listOfFamMemberExistingAppointments = [];
	$scope.allFamilyMembers = [];
	$scope.sorted = [];

	loadFamilyData();
	function loadFamilyData(){	
		var allFamilyMemberRelations = currentUser.relation("familyMember");
  		allFamilyMemberRelations.query().find().then(function(familyMemberResults){
  			familyMemberResults.forEach(function(famMember){

			    //Resetting listOfFamMemberExistingAppointments since it's only for each member, not the whole fam
			    $scope.listOfFamMemberExistingAppointments = []; //resetting array to blank.

			    //preparing to exclude existing appointments, also filling in the scheduled appointment list at the same time.
			    loadFamilyMemberExistingAppointments(famMember).then(function(result){ //NEED TO ensure this finishes populating before you call the next function! It won't break but it relies on this being filled to filter out appointments that don't exist yet.
				
			    	var numExistingAppointments = result;

			    	//looking through all suggested appointments to find relevant ones
			    	loadFamilyMemberSuggestedAppointments(famMember).then(function(result){
			    		var numSuggestedAppointments = result;

			    		var percentage = numExistingAppointments/numSuggestedAppointments*100;

			    		$scope.allFamilyMembers.push({ familyMember: famMember,
	  									  id : famMember.id,
										  name: famMember.get("Name"),
										  icon: famMember.get("icon").url(),
										  dateOfBirth: famMember.get("dateOfBirth"),
										  gender: famMember.get("gender"),
										  scheduled: numExistingAppointments,
										  suggested: numSuggestedAppointments,
										  percent: percentage,

										});
			    		$scope.sorted = $scope.allFamilyMembers.sort(compare);
  					});

			    });
			    
			}); 
			    
		
  		});
  	};

  	   function compare(a,b) {
	  if (a.name < b.name)
	    return -1;
	  if (a.name > b.name)
	    return 1;
	  return 0;
	}

  	function loadFamilyMemberExistingAppointments(famMember){
  		return new Promise(function(resolve, reject) {
		   	var famMemberScheduledAppointmentRelation = famMember.relation("scheduledAppointments");
			famMemberScheduledAppointmentRelation.query().find().then(function(scheduledAppointmentResults){
				$scope.numExistingAppointments=scheduledAppointmentResults.length;
				//alert("infunc" + $scope.numExistingAppointments);
				resolve(scheduledAppointmentResults.length);
				scheduledAppointmentResults.forEach(function(famMemberScheduledAppointment){
					$scope.listOfFamMemberExistingAppointments.push(famMemberScheduledAppointment.get("name"));
					//filling in the all scheduled appointment list while I'm at it, so I don't need to duplicate queries.
					$scope.allScheduledAppointmentList.push({ nameOfAppointment : famMemberScheduledAppointment.get("name"),
													   doctor : famMemberScheduledAppointment.get("doctor"),
													   location : famMemberScheduledAppointment.get("location"),
													   dateScheduled : famMemberScheduledAppointment.get("dateScheduled"),
													   recommendedNextDate : famMemberScheduledAppointment.get("recommendedNextDate"),
													   nameOfFamilyMember : famMember.get("Name"),
													});
					
				});
				
			});
			
		});

  	};

	function loadFamilyMemberSuggestedAppointments(famMember){
		return new Promise(function(resolve, reject) {
	  		//extracting out family member's info
			var today = new Date();
			var birthDate = famMember.get("dateOfBirth");
			var age = today.getFullYear() - birthDate.getFullYear();
		    var m = today.getMonth() - birthDate.getMonth();
		    //if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		    //    age--;
		    //}
		    var ageInMonths = (age * 12) + m;
		    var gender = famMember.get("gender");
		    var nameOfFamMember = famMember.get("Name");
		    var appointmentsToIgnore = famMember.get("ignoredAppointments");

		    var querySuggestedAppointments = new Parse.Query(SuggestedAppointment);
		    var counter = 0;
			querySuggestedAppointments.find().then(function(suggestedAppointmentResults){

				suggestedAppointmentResults.forEach(function(famMemberSuggestedAppointment){

					//getting data of this suggested appointment
				  	var lowerBound = famMemberSuggestedAppointment.get("relevantAgeGroup")[0];
				  	var upperBound = famMemberSuggestedAppointment.get("relevantAgeGroup")[1];
				  	var relevantGender = famMemberSuggestedAppointment.get("relevantGender");
				  	var nameOfSuggestedAppointment = famMemberSuggestedAppointment.get("name");
				  	var frequency = famMemberSuggestedAppointment.get("frequency");
				  	var specialAgeArray = famMemberSuggestedAppointment.get("specialAges");
					

					var padding = 2; //adding padding to the months
					lowerBound = Math.max(0,lowerBound); //ruling out negative numbers
					
					//test to see if appointment already exists, by name
					var existingAppointmentMarker = $scope.listOfFamMemberExistingAppointments.indexOf(nameOfSuggestedAppointment);
					//test to see if user chose to ignore appointment for this fam member
					var ignoredAppointmentMarker = appointmentsToIgnore.indexOf(famMemberSuggestedAppointment.id);
					//check to see if age is among special ages
					var specialAgeMarker = specialAgeArray.indexOf(ageInMonths);

					//test for relevant appointments
				  	if ( ((ageInMonths >= lowerBound - padding && ageInMonths <=upperBound + padding) || specialAgeMarker > -1)
				  		&& (gender==relevantGender || relevantGender == "all")
				  		&& existingAppointmentMarker == -1 
				  		&& ignoredAppointmentMarker == -1)
				  	{
				  		counter += 1; //keeping track of number, for later use.
				  		//Formatting Relevant Strings
				  		var lowerBoundAgeString = formatMonthsToString (lowerBound);
				  		var upperBoundAgeString = formatMonthsToString (upperBound);
				
				  		var keyAgeString = "";
				  		for (i = 0; i <specialAgeArray.length; i++){
				  			var keyAge = specialAgeArray[i];
				  			if (i != 0){
				  				keyAgeString += ", ";
				  			}
				  			keyAgeString += formatMonthsToString(keyAge);
				  		};

				  		var frequencyString = "";
				  		if (frequency == 0){
				  			frequencyString = "consult your doctor";
				  		}else if (frequency ==12) {
				  			frequencyString = "yearly";
				  		}else{
				  			frequencyString = "once every " + formatMonthsToString(frequency);
				  		};
				  		 
				  		 //Adding strings and information to scope
				  		$scope.suggestedAppointmentList.push({  appointmentID : famMemberSuggestedAppointment.id,
				  												famMember : famMember,
				  												famMemberId: famMember.id,
				  												famMemberName: famMember.get("Name"), 
															 	appointmentName: famMemberSuggestedAppointment.get("name"),
															 	lowerBound : lowerBoundAgeString,
															 	upperBound : upperBoundAgeString,
																keyAges: keyAgeString,
																frequency: frequencyString,
																frequencyNum : frequency,
															});

						var famMemberSuggestedAppointmentRelation = famMember.relation("suggestedAppointments");
						//maybe clear all relations first?
						famMemberSuggestedAppointmentRelation.add(famMemberSuggestedAppointment);
						famMember.save();	
				  	};

				});
				resolve(counter);
			});
		});
	};

	function formatMonthsToString(numMonths){
		var formattedString = "";

		if (numMonths < 12){
			formattedString = numMonths.toString() + " months";
		}
		else{
			if (numMonths > 1200){
				formattedString = "old age";
			}
			else{
				numYears = numMonths/12;
				numYearsRounded = Math.round( numYears * 10 ) / 10;
				formattedString = (numYearsRounded).toString() + " years";
			}
		}

		return formattedString;
	}

	$scope.scheduleRecommendedAppointment = function(appointmentName,famMember,frequency){
		//alert("scheduled " + appointmentName + " appointment for " + famMember.get("Name"));
		var famMemberID = famMember.id;
		var myParams = {params: {newAppointmentName: appointmentName, famMemberToAddToForRecommended: famMemberID, recommendedFrequency:frequency}}; 
		var view = new supersonic.ui.View("livypad#addRecommendedEventToGCalandLivyPad");
		supersonic.ui.layers.push(view,myParams);
	}

	$scope.ignoreReccomendation = function(appointmentID, famMember){
		alert("ignored this appointment");
		famMember.addUnique("ignoredAppointments", appointmentID);
		famMember.save();
	}

});



