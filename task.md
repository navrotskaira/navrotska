Task Introduction
The main goal of this task is to evaluate your flexibility, perception, and problem-solving skills in situations that may occur during your work at Ventrata. You will be presented with a real use-case scenario that we frequently encounter, as this specific product setup is used by a large number of our clients. To give you an idea, there are approximately 5,000 such orders processed every day, with roughly 70% of these orders coming from mobile devices. This highlights the importance of being able to test complex products like this one.
Carefully read through the scenario and work step by step to ensure the customer can successfully complete and pay for the order. It won't be easy — you'll face challenges you may not have encountered before, but we believe this task will push you forward.
The estimated time to complete this task is 6 to 8 hours, depending on your experience.
However, it is possible to complete it faster. After writing the task, I personally implemented the full flow, so the complexity, time requirements, and the fact that the problem is solvable have all been verified.
Good to Know Before You Start
Here are a few important details to keep in mind as you approach this automation task. These insights will help you navigate potential challenges and optimize your testing strategy.

Test Environment Considerations
You're testing against a production backend in test mode. Requests may be deprioritized or experience longer response times. Should you encounter such delays, be prepared to leverage Cypress's built-in features for handling it. API Usage and Rate Limiting
During implementation, it's crucial to avoid continuous looping on API requests. Such behavior can be detected as a DDoS attempt, leading to an immediate 24-hour block on your access.

Required Request Headers for API Interaction
If your approach involves triggering requests directly to achieve the desired outcome, you'll need to include specific values in your request headers. This ensures proper authentication and access to necessary functionalities:
headers: {
"Content-Type": "application/json",
"Authorization": "Bearer d869fd06-fb61-497b-9c36-e92065ca3430",
"Octo-capabilities": "octo/content, octo/pricing, octo/extras,octo/offers,octo/packages"
}

Leveraging Your Tester's Intuition
Finally, please note that this task description doesn't cover every single user interaction or validation point. There will be instances where your tester's judgment is essential. Consider whether a particular action or state is critical to verify, whether it would cause a significant problem for a customer, or if it presents an interesting edge case to explore. Your ability to identify and address these implicit testing opportunities will be a key part of this assessment.
Application Setup
You'll need to run the application locally. Grab the code from this JSFiddle. You can use the entire <!DOCTYPE > structure provided there and copy & paste into your own index.html. Once you host this on your localhost, the button should behave exactly as it does in the JSFiddle example. https://jsfiddle.net/SebastianV/zpms5xvq/ QA Automation Task: Booking Flow
Objective: Implement an automated test script using Cypress to validate the booking flow for the
"NYC Icons Express - 1 Day Adventure" package, covering various user interactions, validations, and edge cases.

Scenario Steps & Expected Behavior

1. Navigate to Product Page & Initial Selection:
   As a customer, navigate to the product page.
   Select the "NYC Icons Express - 1 Day Adventure" package. This package contains 4 individual products.

2. Ticket Quantity & Booking Window:
   The "NYC Icons Express" package is highly popular. The maximum booking window (weeks in advance) is dynamic and can be configured by the client.
   The maximum number of tickets per single purchase is limited to 20.
   Action: The customer is unsure of the exact number of tickets needed. Therefore, select a random number of tickets for each of the two available ticket options (e.g., Adult, Child) within the allowed limits.

3. Date Selection - Initial Product:
   Proceed to the next step in the booking flow.
   Observation: Initially, only the first product within the package should be available for date selection.
   Action: For this first product, select today's date.
   Expected Outcome: Upon confirming today's date for the first product, all remaining products within the package should become accessible.
   note: This functionality ensures customers don't need to select the same date for every product, as they are intended to be visited on the same day.

4. Date & Time Selection - Subsequent Product (Two Scenarios):
   Proceed to the next required product in the flow.
   Prepare both scenarios in one test:
   Scenario A (Happy Path): Timeslots are available until 15:00
   Action: The application allows confirming today's date. Randomly select an available timeslot and confirm the selection.
   Scenario B (Edge Case - Closed Slots): Timeslots are available after 15:00
   Action: The application does not allow confirming today's date because all timeslots or the entire day are assigned in the response with the status: "closed".
   Action: Close the product's date/time selection modal/section.

5. Reset selection:
   Action: Despite the previous selection, the customer decides the chosen times are unsuitable. Use the "Reset selection" option.
   Expected Outcome: The selection for all products should be reset.

6. Revised Date & Time Selection (Full Flow):
   Action: This time, for the first required product, select the last available booking date/timeslot and confirm the selection.
   Action: Repeat this process for all other mandatory products in the package.
   Action: Once all mandatory products have a selected date and time, continue the booking flow, leaving optional products unselected.

7. Questions Page & Validation:
   Action: Navigate to the questions page.
   Action: Attempt to proceed to the next step without filling in any mandatory questions.
   Expected Outcome: A validation error should prevent progression.
   Action: Fill in all mandatory fields on the questions page.
   Expected Outcome: Successfully proceed to the checkout page.

8. Checkout Page - Price & Promo Code:
   Action: On the checkout page, verify that the total price in the widget's footer matches the expected amount.
   Action: Enter the promo code "CYPRESSFREE".
   Expected Outcome: Verify that the promo code is applied correctly and the price updates accordingly.

9. Finalizing the Order:
   Action: Fill in all mandatory Contact fields.
   Action: Confirm the order.
   Expected Outcome: If all steps are successful, the user should be redirected to a
   "Success" page showing the paid price.

Optional Bonus Task
If you've successfully completed the main task and everything is stable, consider adapting your tests to run on both desktop and mobile devices. This change should be quick, taking only a few minutes.

Customer Flow Reference
To help you visualize the customer journey and product behavior, here are video walkthroughs of the booking flow on both mobile and desktop devices. Use these as a general reference for how the application should appear and function from a user's perspective.Mobile Device Flow:
https://www.loom.com/share/cac1ea43dede4af8b0683d54aa2a7c31?sid=76cab356-087f-4653-
a732-8a5fbd6c8eOf
Desktop Device Flow: https://www.loom.com/share/924b8abbbb774a30a68ed6af59e51abb?
sid=e3096f00-1fb6-4a3a-80ad-9ed29abd7924

Evaluation Criteria
Your solution will be evaluated on:
Task Completion: How well you cover the scenario's key steps and critical paths.
Test Stability: The reliability and robustness of your tests.
Code Quality: Clarity, readability in your code.

Expected Output
The expected output is a public repository containing a Cypress interview project. This project should be runnable ideally with a single command and should successfully execute the test scenario mentioned above without any issues.

Task Submission
Share the public repository link via email within 7 days of receiving the assignment. Please make sure the repository is set to public before submitting.

What You Can Expect from Us
You can expect a thorough review of your task, including code review, as well as feedback or suggestions for any missing or incorrect parts of the solution. Good Luck!
