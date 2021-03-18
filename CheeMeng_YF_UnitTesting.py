import CheeMeng_yFinanceCrawler as yfClasses
import unittest
import validators

def main():
    ########Test inputs for getParser()########

    # Test if url is valid
    invalidUrl = "asdfasdf"
    validUrl = "https://sg.finance.yahoo.com/industries/energy"
    testParser = yfClasses.YFinanceCrawler("")

    # Invalid url
    print(invalidUrl)
    testParser_invalid = testParser.getParser(invalidUrl)

    # Valid url
    print()
    print(validUrl)
    testParser_valid = testParser.getParser(validUrl)

    # testHistoricalData = yfClasses.YFinanceCrawler(symbol)


if __name__ == "__main__":
    main()
