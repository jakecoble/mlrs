# Multi-Launch Resume System

NOTE: This application is in an unfinished state and is not guaranteed to do anything useful. It should fill out some forms fine, but there are many different web forms to account for, and MLRS has not been adapted to work with most of them.

A command-line tool for fetching job listings from Indeed and automating repetitive parts of the job-application process

## Installation

```
git clone https://github.com/jakecoble/mlrs
cd mlrs
npm install -g
```

## Usage

`mlrs fetch` to pull job listings from Indeed. `mlrs fire [file]` to start applying to fetched jobs. Use `mlrs --help` for a description of available options.

## Explanation

MLRS uses a Google Chrome browser controlled via the Puppeteer library to automate parts of the job-application process, including filling out basic information and uploading a resume.

The application uses the NodeJS stream API. This means that records are read from the file and processed one at a time instead of reading the whole file into memory. This is probably unnecessary, since the CSV files aren't likely to be very large, but I wanted to learn how to use streams, so I did it.
