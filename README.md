# Multi-Launch Resume System

A command-line tool for fetching job listings from Indeed and automating repetitive parts of the job-application process

`mlrs fetch` to pull job listings from Indeed. `mlrs fire [file]` to start applying to fetched jobs. Use `mlrs --help` for a description of available options.

MLRS uses a Google Chrome browser controlled via the Puppeteer library to automate parts of the job-application process, including filling out basic information and uploading a resume.

The application uses the NodeJS stream API. This means that records are read from the file and processed one at a time instead of reading the whole file into memory. This is probably unnecessary, since the CSV files aren't likely to be very large, but I wanted to learn how to use streams, so I did it.
