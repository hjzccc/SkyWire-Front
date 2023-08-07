import {
  getPlaceHolders,
  replacePlaceHolders,
} from "@/common/placeHolderUtils";

describe("getPlaceHolders", () => {
  it("should return null for empty string", () => {
    expect(getPlaceHolders("")).toEqual([]);
  });

  it("should return null for string without placeholders", () => {
    expect(getPlaceHolders("Hello, world!")).toEqual([]);
  });

  it("should return array of placeholders for string with placeholders", () => {
    expect(getPlaceHolders("Hello, {$name}!")).toEqual(["name"]);
    expect(getPlaceHolders("{$firstName} {$lastName}")).toEqual([
      "firstName",
      "lastName",
    ]);
  });

  it("should return array of unique placeholders for string with duplicate placeholders", () => {
    expect(getPlaceHolders("{$name} {$name}")).toEqual(["name", "name"]);
  });
});

describe("replacePlaceHolders", () => {
  it("should return original string for empty parameters", () => {
    expect(replacePlaceHolders({}, "Hello, world!")).toEqual("Hello, world!");
  });

  it("should replace placeholders with corresponding parameter values", () => {
    const parameters = { name: "John", age: "30" };
    expect(replacePlaceHolders(parameters, "Hello, {$name}!")).toEqual(
      "Hello, John!"
    );
    expect(
      replacePlaceHolders(parameters, "Name: {$name}, Age: {$age}")
    ).toEqual("Name: John, Age: 30");
  });

  it("should ignore placeholders without corresponding parameter values", () => {
    const parameters = { name: "John" };
    expect(replacePlaceHolders(parameters, "Hello, {$name}!")).toEqual(
      "Hello, John!"
    );
    expect(
      replacePlaceHolders(parameters, "Name: {$name}, Age: {$age}")
    ).toEqual("Name: John, Age: {$age}");
  });

  it("should ignore extra parameter values", () => {
    const parameters = { name: "John", age: "30" };
    expect(replacePlaceHolders(parameters, "Hello, {$name}!")).toEqual(
      "Hello, John!"
    );
  });
});
