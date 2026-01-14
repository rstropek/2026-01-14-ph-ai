Your task is to do a code review of a student's submission for a coding exam. Note that students did NOT create this solution from scratch. They were given a starter codebase. Only review the code in the files mentioned below. Do not review any other files as they were provided as part of the starter code.

Perform the following steps:

* Find the root directory of the student's submission by looking for a *.sln file. From now on, I will refer to this directory as the "submission root".
* Read the `readme.md` file in the submission root to understand the requirements.
* Read the `results-build-test.md` file in the submission root to see whether the code could be built and run successfully.
* Do a code review of the importer by reviewing the code in the following files (and potentially referenced code in other files if they are used by the files below).
  * `TypedCsvParser.cs`
  * `ProductsImportDatabaseWriter.cs`
* Do a code review of the Web API endpoints that were required to be implemented.
* Do a code review of the Web API Integration Tests (`WebApiTests`). Note that the following tests were already part of the starter code and do NOT need to be reviewed:
  * GetCategories_ReturnsOk
  * GetProducts_ReturnsOk
  * GetProducts_WithCategoryFilter_ReturnsOk
  * GetProducts_WithMaxUnitPriceFilter_ReturnsOk
  * GetProducts_WithBothFilters_ReturnsOk
  * GetProductById_WithNonExistentId_ReturnsNotFound
  * GetProductById_WithValidId_ReturnsOkOrNotFound
  * UpdateProduct_WithValidData_ReturnsOk
  * UpdateProduct_WithNonExistentId_ReturnsNotFound
  * UpdateProduct_WithEmptyProductCode_ReturnsBadRequest
  * UpdateProduct_WithEmptyProductName_ReturnsBadRequest
  * UpdateProduct_WithProductCodeTooLong_ReturnsBadRequest
  * UpdateProduct_WithProductNameTooLong_ReturnsBadRequest
  * UpdateProduct_WithDescriptionTooLong_ReturnsBadRequest
  * UpdateProduct_WithCategoryTooLong_ReturnsBadRequest
  * UpdateProduct_WithZeroPrice_ReturnsBadRequest
  * UpdateProduct_WithNegativePrice_ReturnsBadRequest
  * UpdateProduct_WithNullOptionalFields_ReturnsOk
  * DeleteProduct_WithNonExistentId_ReturnsNotFound
  * DeleteProduct_WithValidId_ReturnsNoContentOrNotFound
* Do a code review of the Frontend (Angular). The students were given a nearly empty starter code. They had to add the product list and product edit components from scratch (as noted in the `readme.md` file).

At the end, create a file `results-code-review.md` in the current folder (not the submission root) containing the following information:

* Code review of the importer
* Code review of the Web API endpoints
* Code review of the Web API Integration Tests
* Code review of the Frontend (Angular)
* Summary with overall impressions, strengths, weaknesses, and suggestions for improvement

## Important Code Review Points

When you do your code review, also consider the following points (but not limited to them):

* Is the code ideomatic and following best practices for the respective technology?
* Is the code logically correct and fulfilling the requirements as specified in the `readme.md` file?
* For C#: Is async/await used consistently for database operations?
* For Angular: Does the code use modern Angular features?
  * Signals
  * Standalone components
  * New control flow syntax (e.g. `@if` instead of `*ngIf`)
* Are error cases and edge cases handled properly?
