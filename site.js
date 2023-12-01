(function ($) {
  function toggleExpediteElement() {
    var selectedOption = $("#Physical-Therapy-Start-Date").val();
    var expediteElement = $("#expedite");

    if (selectedOption === "This week" || selectedOption === "Next week") {
      expediteElement.removeClass("hide");
    } else {
      expediteElement.addClass("hide");
    }
  }
  $("#Physical-Therapy-Start-Date").on("change", toggleExpediteElement);

  function toggleInsuranceElements() {
    var selectedOption = $("#haveInsurance").val();
    var noInsuranceWrapper = $("#noInsuranceWrapper");
    var typeOfInsuranceWrapper = $("#typeOfInsuranceWrapper");
    var relationshipVal = $("#relationship").val();
    var primarySubscriberWrapper = $("#primarySubscriberWrapper");
    var medicareWrapper = $("#medicareWrapper");
    var secondaryWrapper = $("#secondaryWrapper");
    var otherInsuranceProviderWrapper = $("#otherInsuranceProviderWrapper");
    var secondaryInsuranceProvider = $("#secondaryInsuranceProvider").val();
    var secondaryOtherPrimaryQuestionWrapper = $(
      "#secondaryOtherPrimaryQuestionWrapper",
    );
    var secondaryPrimarySubscriberWrapper = $(
      "#secondaryPrimarySubscriberWrapper",
    );
    var privateInsuranceWrapper = $("#privateInsuranceWrapper");
    var privateOtherInsuranceProviderWrapper = $(
      "#privateOtherInsuranceProviderWrapper",
    );
    var privateInsuranceProvider = $("#privateInsuranceProvider").val();
    var relationshipInsuranceWrapper = $("#relationshipInsuranceWrapper");

    noInsuranceWrapper.addClass("hide");
    typeOfInsuranceWrapper.addClass("hide");
    medicareWrapper.addClass("hide");
    secondaryWrapper.addClass("hide");
    privateInsuranceWrapper.addClass("hide");
    relationshipInsuranceWrapper.addClass("hide");
    primarySubscriberWrapper.addClass("hide");
    secondaryOtherPrimaryQuestionWrapper.addClass("hide");
    secondaryPrimarySubscriberWrapper.addClass("hide");
    otherInsuranceProviderWrapper.addClass("hide");
    privateOtherInsuranceProviderWrapper.addClass("hide");

    if (selectedOption === "No") {
      noInsuranceWrapper.removeClass("hide");
    } else if (selectedOption === "Yes") {
      typeOfInsuranceWrapper.removeClass("hide");
      var selectedInsuranceType = $("#selectedInsuranceType").val();

      if (selectedInsuranceType === "Medicare") {
        relationshipInsuranceWrapper.removeClass("hide");
        if (
          relationshipVal === "Spouse" ||
          relationshipVal === "Child" ||
          relationshipVal === "Other"
        ) {
          primarySubscriberWrapper.removeClass("hide");
          medicareWrapper.removeClass("hide");
        } else if (relationshipVal === "Self") {
          medicareWrapper.removeClass("hide");
        } else {
          medicareWrapper.addClass("hide");
        }
      } else if (
        selectedInsuranceType === "Medicare with secondary insurance"
      ) {
        relationshipInsuranceWrapper.removeClass("hide");
        if (
          relationshipVal === "Spouse" ||
          relationshipVal === "Child" ||
          relationshipVal === "Other"
        ) {
          primarySubscriberWrapper.removeClass("hide");
          medicareWrapper.removeClass("hide");
          secondaryWrapper.removeClass("hide");
          secondaryOtherPrimaryQuestionWrapper.removeClass("hide");
          if (secondaryInsuranceProvider === "Other") {
            otherInsuranceProviderWrapper.removeClass("hide");
          }
        } else if (relationshipVal === "Self") {
          medicareWrapper.removeClass("hide");
          secondaryWrapper.removeClass("hide");
          if (secondaryInsuranceProvider === "Other") {
            otherInsuranceProviderWrapper.removeClass("hide");
          }
        } else {
          medicareWrapper.addClass("hide");
        }
      } else if (selectedInsuranceType === "Private insurance") {
        relationshipInsuranceWrapper.removeClass("hide");
        if (
          relationshipVal === "Spouse" ||
          relationshipVal === "Child" ||
          relationshipVal === "Other"
        ) {
          primarySubscriberWrapper.removeClass("hide");
          privateInsuranceWrapper.removeClass("hide");
          if (privateInsuranceProvider === "Other") {
            privateOtherInsuranceProviderWrapper.removeClass("hide");
          }
        } else if (relationshipVal === "Self") {
          privateInsuranceWrapper.removeClass("hide");
          if (privateInsuranceProvider === "Other") {
            privateOtherInsuranceProviderWrapper.removeClass("hide");
          }
        } else {
          privateInsuranceWrapper.addClass("hide");
          if (privateInsuranceProvider === "Other") {
            privateOtherInsuranceProviderWrapper.removeClass("hide");
          }
        }
      }
    }
    $("input[name='secondaryOtherPrimaryQuestion']").on(
      "change",
      handleSecondaryOtherPrimaryQuestionChange,
    );

    // Check if selected insurance type is "Medicare with secondary insurance"
    if (
      $("#selectedInsuranceType").val() === "Medicare with secondary insurance"
    ) {
      // Check the relationship
      if ($("#relationship").val() !== "Self") {
        // Gather data for verification
        var secondaryOtherPrimaryQuestionVal = $(
          "input[name='secondaryOtherPrimaryQuestion']:checked",
        ).val();

        if (secondaryOtherPrimaryQuestionVal === "No") {
          secondaryPrimarySubscriberWrapper.removeClass("hide");
        } else {
          secondaryPrimarySubscriberWrapper.addClass("hide");
        }
      }
    } else {
      secondaryPrimarySubscriberWrapper.addClass("hide");
    }
  }

  $(
    "#haveInsurance, #selectedInsuranceType, #relationship, #secondaryInsuranceProvider, #privateInsuranceProvider",
  ).on("change", toggleInsuranceElements);

  function handleSecondaryOtherPrimaryQuestionChange() {
    var secondaryOtherPrimaryQuestionVal = $(
      "input[name='secondaryOtherPrimaryQuestion']:checked",
    ).val();

    if (secondaryOtherPrimaryQuestionVal === "No") {
      $("#secondaryPrimarySubscriberWrapper").removeClass("hide");
    } else {
      $("#secondaryPrimarySubscriberWrapper").addClass("hide");
    }
  }

  $("input[name='secondaryOtherPrimaryQuestion']").on(
    "change",
    handleSecondaryOtherPrimaryQuestionChange,
  );

  // Add event listener for relationship change
  $("#relationship").on("change", function () {
    // Check the value of secondaryOtherPrimaryQuestion when relationship changes
    handleSecondaryOtherPrimaryQuestionChange();
  });

  toggleInsuranceElements();

  function toggleEligibleElement() {
    var instabilitySelect = $(
      "#Are-you-experiencing-instability-pain-or-weakness-in-the-back-or-knees",
    ).val();
    var insuranceSelect = $("#selectedInsuranceType").val();
    var eligibleElement = $("#eligible");

    if (
      instabilitySelect === "Yes" &&
      (insuranceSelect === "Medicare" ||
        insuranceSelect === "Medicare with secondary insurance")
    ) {
      eligibleElement.removeClass("hide");
    } else {
      eligibleElement.addClass("hide");
    }
  }

  $(
    "#Are-you-experiencing-instability-pain-or-weakness-in-the-back-or-knees, #selectedInsuranceType",
  ).on("change", toggleEligibleElement);

  toggleEligibleElement();

  // Use an AJAX request to get the JSON data from the API
  $.ajax({
    url: "https://api.petehealth.com/api/insurances",
    method: "GET",
    beforeSend: function (xhr) {
      // Set the Authorization header
      xhr.setRequestHeader("Authorization", "Basic dmhlcm9uLmt0bGE6MTIzNDU2");
    },
    success: function (data) {
      // Assuming data is an array of objects from the API response
      // Filter out items where payer_id is not null and test_record is false
      var filteredData = data.filter(function (item) {
        return item.payer_id !== null && item.test_record === false;
      });

      // Sort the filtered data alphabetically by the "name" property
      filteredData.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

      // Loop through the sorted data and update the select fields
      updateSelectField($("#secondaryInsuranceProvider"), filteredData);
      updateSelectField($("#privateInsuranceProvider"), filteredData);
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });

  // Function to update a select field with filtered data
  function updateSelectField(select, filteredData) {
    // Clear the existing options
    select.empty();

    // Add the "Select one..." option
    select.append('<option value="">Select one...</option>');

    // Loop through the sorted data and add options to the select
    filteredData.forEach(function (item) {
      // Add an option with the id as the value and name as the display text
      select.append(
        '<option value="' + item.id + '">' + item.name + "</option>",
      );
    });

    // Add the "Other" option at the end
    select.append('<option value="Other">Other</option>');
  }

  var leadId;
  var formattedDOB;
  var firstName;
  var lastName;

  async function createLead(data) {
    try {
      const response = await fetch("https://api.petehealth.com/webhooks/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic dmhlcm9uLmt0bGE6MTIzNDU2",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Log the entire response
        console.log("POST Request Response:", result);

        // Return the lead ID
        return result.id;
      } else {
        // Log the error response
        console.error("POST Request Error:", result);
        return null;
      }
    } catch (error) {
      // Log any errors that occur during the POST request
      console.error("POST Request Error:", error);
      return null;
    }
  }

  // Step 1

  $("#createLead").click(async function (e) {
    // Prevent the default button click behavior
    e.preventDefault();

    // Show loader
    $(".booking-form_loader").removeClass("hide");

    // Gather the data to send in the POST request from your form fields
    firstName = $("#leadFirstName").val();
    lastName = $("#leadLastName").val();
    var phoneNumber = $("#leadPhoneNumber").val();
    var email = $("#leadEmail").val();
    var dob = $("#leadDOB").val();

    // Parse the date using Flatpickr and then format it to the desired format
    var parsedDate = flatpickr.parseDate(dob, "m/d/Y");
    formattedDOB = flatpickr.formatDate(parsedDate, "Y-m-d");
    var contactMethod = $('input[name="leadContactMethod"]:checked').val();

    // Create an object with the data
    var data = {
      lead_source: "petehealth.com",
      lead_source_description: "Booking Form",
      patient_first_name: firstName,
      patient_last_name: lastName,
      patient_phone: phoneNumber,
      date_of_birth: formattedDOB,
      contact_preferences: contactMethod,
    };

    try {
      // Call the createLead function
      leadId = await createLead(data);

      // If leadId is not null, log it and continue with the next steps or update UI as needed
      if (leadId !== null) {
        console.log("Lead ID:", leadId);
        // Continue with the next steps or update UI as needed

        // For example, hide the loader and go to the next step
        $(".booking-form_loader").addClass("hide");
        // Trigger the next step programmatically if needed
        document.querySelector("#createLeadNextStepButton").click();
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      // Handle error, e.g., show an error message
    } finally {
      // Regardless of success or error, hide the loader
      $(".booking-form_loader").addClass("hide");
    }
  });

  // Step 2

  $("#updateLeadAddress").click(async function (e) {
    // Prevent the default button click behavior
    e.preventDefault();

    // Check if leadId is defined
    if (leadId === undefined) {
      console.error("leadId is not defined");
      return;
    }

    // Show loader
    $(".booking-form_loader").removeClass("hide");

    // Gather the data from the form fields for this section
    var streetAddress = $("#leadStreetAddress").val();
    var streetAddress2 = $("#leadStreetAddress-2").val();
    var city = $("#leadCity").val();
    var state = $("#leadState").val();
    var zip = $("#leadZip").val();
    var startDate = $("#leadStartDate").val();

    // Create an object with the data
    var data = {
      street_address: streetAddress,
      street_address2: streetAddress2,
      city: city,
      state: state,
      zip: zip,
      start_date: startDate,
    };

    try {
      // Send a POST request to update the lead information
      const response = await fetch(
        "https://api.petehealth.com/webhooks/lead/" + leadId, // Use the lead ID in the URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic dmhlcm9uLmt0bGE6MTIzNDU2",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log("POST Request Response:", result);
        // Continue with the next steps or update UI as needed

        // For example, hide the loader and go to the next step
        $(".booking-form_loader").addClass("hide");
        // Trigger the next step programmatically if needed
        document.querySelector("#updateLeadAddressNextButton").click();
      } else {
        console.error("POST Request Error:", result);
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error("POST Request Error:", error);
      // Handle other errors
    } finally {
      // Regardless of success or error, hide the loader
      $(".booking-form_loader").addClass("hide");
    }
  });

  // Step 3

  $("#updateLeadNeeds").click(async function (e) {
    // Prevent the default button click behavior
    e.preventDefault();

    // Check if leadId is defined
    if (leadId === undefined) {
      console.error("leadId is not defined");
      return;
    }

    // Show loader
    $(".booking-form_loader").removeClass("hide");

    // Gather the data from the form fields for this section
    var ptSupport = $("#leadPtSupport").val();
    var weaknessOrInstability = $("#leadWeaknessOrInstability").val();

    // Create an object with the data
    var data = {
      pt_support: ptSupport,
      weakness_or_instability: weaknessOrInstability,
    };

    try {
      // Send a POST request to update the lead information
      const response = await fetch(
        "https://api.petehealth.com/webhooks/lead/" + leadId, // Use the lead ID in the URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic dmhlcm9uLmt0bGE6MTIzNDU2",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log("POST Request Response:", result);
        // Continue with the next steps or update UI as needed

        // For example, hide the loader and go to the next step
        $(".booking-form_loader").addClass("hide");
        // Trigger the next step programmatically if needed
        document.querySelector("#updateLeadNeedsNextButton").click();
      } else {
        console.error("POST Request Error:", result);
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error("POST Request Error:", error);
      // Handle other errors
    } finally {
      // Regardless of success or error, hide the loader
      $(".booking-form_loader").addClass("hide");
    }
  });

  // Function to send a POST request for verification
  async function runVerification(data) {
    try {
      const response = await fetch(
        "https://api.petehealth.com/webhooks/verification/run/web",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic dmhlcm9uLmt0bGE6MTIzNDU2",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Verification Request Response:", result);
        handleVerificationSuccess(result);
        $(".booking-form_loader").addClass("hide");
      } else {
        console.error("Verification Request Error:", result);
        handleVerificationError(result);
      }
    } catch (error) {
      console.error("Verification Request Error:", error);
      // Handle other errors
      $(".booking-form_loader").addClass("hide");
    }
  }

  function handleVerificationSuccess(result) {
    // Process the success response as needed
    // For now, let's log the message to the console
    console.log("Verification Success Message:", result.message);

    // Update the DOM
    updateDOMOnVerification(result.message);
  }

  function handleVerificationError(result) {
    // Process the error response as needed
    // For now, let's log the error message to the console
    console.error("Verification Error Message:", result.message);

    // Update the DOM
    updateDOMOnVerification(result.message);
  }

  function updateDOMOnVerification(message) {
    // Find the success wrapper element
    const successWrapper = $(".booking-form_success-wrapper");

    // Find the text-size-large element and update its text
    successWrapper.find(".text-size-large").text(message);

    // Hide the booking form
    $("#wf-form-Booking-Flow").hide();

    // Show the success wrapper
    successWrapper.show();
  }

  // Run verification on form submission if they don't have insurance
  document
    .querySelector("#submitForm")
    .addEventListener("click", async function (e) {
      // Show loader
      $(".booking-form_loader").removeClass("hide");

      // Check if the user has insurance
      if ($("#haveInsurance").val() === "Yes") {
        // Check the type of insurance
        if ($("#selectedInsuranceType").val() === "Medicare") {
          // Check the relationship
          if ($("#relationship").val() === "Self") {
            // Gather data for verification
            var medicareNumberVal = $("#medicare-number").val();

            var verificationData = {
              lead_id: leadId,
              first_name: firstName,
              last_name: lastName,
              dob: formattedDOB,
              medicare_number: medicareNumberVal,
              medicare_ins_provider: "8065222",
              medicare_patient_rel_to_insured: $("#relationship").val(),
            };

            console.log(verificationData);

            // Call the runVerification function
            await runVerification(verificationData);
          } else {
            // Handle other relationship cases for Medicare
            // Gather data for verification
            var medicareNumberVal = $("#medicare-number").val();
            var primaryFormattedDOB = getFormattedDOB("#Subscribers-DOB");

            var verificationData = {
              lead_id: leadId,
              medicare_number: medicareNumberVal,
              medicare_ins_provider: "8065222",
              medicare_patient_rel_to_insured: $("#relationship").val(),
              medicare_pri_first_name: $("#Subscribers-First-Name").val(),
              medicare_pri_last_name: $("#Subscribers-Last-Name").val(),
              medicare_pri_dob: primaryFormattedDOB,
            };

            console.log(verificationData);

            // Call the runVerification function
            await runVerification(verificationData);
          }
        } else if (
          $("#selectedInsuranceType").val() ===
          "Medicare with secondary insurance"
        ) {
          // Check the relationship
          if ($("#relationship").val() === "Self") {
            // Gather data for verification
            var medicareNumberVal = $("#medicare-number").val();
            var formattedDOB = getFormattedDOB("#Subscribers-DOB");

            var verificationData = {
              lead_id: leadId,
              first_name: firstName,
              last_name: lastName,
              dob: formattedDOB,
              medicare_number: medicareNumberVal,
              medicare_ins_provider: "8065222",
              medicare_patient_rel_to_insured: $("#relationship").val(),
              sec_ins_provider: $("#secondaryInsuranceProvider").val(),
              sec_member_id: $("#secondaryInsuranceMemberID").val(),
            };

            console.log(verificationData);

            // Call the runVerification function
            await runVerification(verificationData);
          } else {
            // Gather data for verification
            var medicareNumberVal = $("#medicare-number").val();
            var primaryFormattedDOB = getFormattedDOB("#Subscribers-DOB");

            var verificationData = {
              lead_id: leadId,
              medicare_number: medicareNumberVal,
              medicare_ins_provider: "8065222",
              medicare_patient_rel_to_insured: $("#relationship").val(),
              medicare_pri_first_name: $("#Subscribers-First-Name").val(),
              medicare_pri_last_name: $("#Subscribers-Last-Name").val(),
              medicare_pri_dob: primaryFormattedDOB,
              sec_ins_provider: $("#secondaryInsuranceProvider").val(),
              sec_member_id: $("#secondaryInsuranceMemberID").val(),
              sec_patient_rel_to_insured: $("#relationship").val(),
            };

            // Check if the primary subscriber is the same
            if ($("#secondaryOtherPrimaryQuestion").val() === "Yes") {
              verificationData.sec_first_name = $(
                "#Subscribers-First-Name",
              ).val();
              verificationData.sec_last_name = $(
                "#Subscribers-Last-Name",
              ).val();
              verificationData.sec_dob = formattedDOB;
            } else {
              // New fields show up
              verificationData.sec_first_name = $(
                "#secondaryPrimarySubscriberFirstName",
              ).val();
              verificationData.sec_last_name = $(
                "#secondaryPrimarySubscriberLastName",
              ).val();
              verificationData.sec_dob = getFormattedDOB(
                "#secondaryPrimarySubscriberDOB",
              );
            }

            console.log(verificationData);

            // Call the runVerification function
            await runVerification(verificationData);
          }
        } else if ($("#selectedInsuranceType").val() === "Private insurance") {
          // Check the relationship
          if ($("#relationship").val() === "Self") {
            // Gather data for verification
            var verificationData = {
              lead_id: leadId,
              first_name: firstName,
              last_name: lastName,
              dob: formattedDOB,
              pri_member_id: $("#Private-insurance-member").val(),
              pri_ins_provider: $("#privateInsuranceProvider").val(),
            };

            console.log(verificationData);

            // Call the runVerification function
            await runVerification(verificationData);
          } else {
            // Gather data for verification
            var primaryFormattedDOB = getFormattedDOB("#Subscribers-DOB");

            var verificationData = {
              lead_id: leadId,
              pri_ins_provider: $("#privateInsuranceProvider").val(),
              pri_patient_rel_to_insured: $("#relationship").val(),
              pri_first_name: $("#Subscribers-First-Name").val(),
              pri_last_name: $("#Subscribers-Last-Name").val(),
              pri_dob: primaryFormattedDOB,
              pri_member_id: $("#Private-insurance-member").val(),
            };

            console.log(verificationData);

            // Call the runVerification function
            await runVerification(verificationData);
          }
        }
      } else {
        // If #haveInsurance === no
        // Gather the data for verification
        var verificationData = {
          lead_id: leadId,
          pri_ins_provider: "8065230",
          pri_patient_rel_to_insured: "Self",
        };

        console.log(verificationData);

        // Call the runVerification function
        await runVerification(verificationData);
      }
    });
})(jQuery);
