Feature: Login functionality for Titan Eye Plus website

  Background: User visits the Titan Eye Plus website
    Given the user is on the Titan Eye Plus homepage

  Scenario: User logs in using OTP sent to Gmail
    Given the user enters their registered mobile number
    When the user retrieves the OTP from their Gmail account and submits it
    Then the user should be logged in successfully
    And the profile details of the user are verified
    When the user logs out
    Then the user should be logged out successfully


  Scenario: Verifying registered email address in Profile Details
    Given the user enters their registered mobile number
    When the user retrieves the OTP from their Gmail account and submits it
    Then the user should be logged in successfully
    And the email address details of the user are verified
    When the user logs out
    Then the user should be logged out successfully


