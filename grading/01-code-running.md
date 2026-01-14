Your task is to test the submission of a student for a coding exam. Perform the following steps:

* Find the root directory of the student's submission by looking for a *.sln file. From now on, I will refer to this directory as the "submission root".
* Delete all *.db files in the submission root and its subdirectories.
* Delete all bin, obj, and node_modules directories in the submission root and its subdirectories.
* The `AppHost` directory inside the submission root contains a file named `appsettings.json`. It contains a `path` and a `fileName` setting. Update the `path` setting to point to the solution root directory and ensure the `fileName` setting is set to `database.db`.
* Build the code in the submission root using `dotnet build`. If this fails, skip all further steps and document the errors in the `results-build-test.md` file as described below.
* Apply EFCore migrations by running `dotnet ef database update` in the `AppService` directory inside the submission root. After running it, make sure a `database.db` file is created in the solution root directory. If this fails, skip all further steps and document the errors in the `results-build-test.md` file as described below.
* In the `Importer` directory, run `dotnet run -- ../../data/valid.txt` to fill the database with initial data.
* In the `Frontend` directory inside the submission root, run `npm install` followed by `npm run build`.
* Run all tests with `dotnet test` in the submission root.

At the end, create a file `results-build-test.md` in the current folder (not the submission root) containing the following information:

* Did .NET build succeed? If no, take a look at the corresponding source code and provide a brief explanation of each error. This has to be done for warnings and errors.
* Did EFCore migrations succeed? If no, provide the error message.
* Did the importer run succeed? If no, provide the error message.
* Did the frontend build succeed? If no, take a look at the corresponding source code and provide a brief explanation of each error.
* Did all tests pass? If no, provide a list of the names of the failed tests. Take a look at the corresponding source code and provide a brief explanation of each failure.

So the final `results-build-test.md` file should look like this:

```md
# Test Results

Folder: [path to submission root]

## .NET Build

- Succeeded: [ No errors or warnings | With warnings | Failed ]

### [First Warning/Error]

[Brief explanation of the warning/error and its cause]

...

## EFCore Migrations

- Succeeded: [ Yes | No ]

[ If No, provide the error message here ]

## Importer Run

- Succeeded: [ Yes | No ]

[ If No, provide the error message here ]

## Frontend Build

- Succeeded: [ No errors or warnings | With warnings | Failed ]

### [First Warning/Error]

[Brief explanation of the warning/error and its cause]

...

## Tests

- All Passed: [ Yes | No ]

### Failed Tests

* [Name of Failed Test 1]
* ...

### [First Failed Test Explanation]

[Brief explanation of the failure and its cause]

...
```
