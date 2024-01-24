import _orderBy from 'lodash/orderBy';

export function DictionaryMapper(Dictionary) {
  const AnnualIncomeLOV = Dictionary[5].datadictionary;
  const IdTypes = Dictionary[9].datadictionary;
  const Occupation = _orderBy(Dictionary[1].datadictionary, ['description'], ['asc']);
  const SourceOfFunds = _orderBy(Dictionary[8].datadictionary, ['description'], ['asc']);
  const State = _orderBy(Dictionary[6].datadictionary, ['description'], ['asc']);
  const Business = _orderBy(Dictionary[2].datadictionary, ['description'], ['asc']);
  const Nationality = _orderBy(Dictionary[3].datadictionary, ['description'], ['asc']);
  const Country = _orderBy(Dictionary[4].datadictionary, ['description'], ['asc']);
  const Purpose = Dictionary[15].datadictionary;
  const Interest = Dictionary[16].datadictionary;
  const Gender = Dictionary[11].datadictionary;
  const Title = Dictionary[12].datadictionary;
  const MaritalStatus = Dictionary[10].datadictionary;
  const Race = _orderBy(Dictionary[13].datadictionary, ['description'], ['asc']);
  const Banks = _orderBy(Dictionary[19].datadictionary, ['description'], ['asc']);
  const CountryCor = _orderBy(Dictionary[28].datadictionary, ['description'], ['asc']);
  const TaxResidentNoIDReasons = _orderBy(Dictionary[29].datadictionary, ['codevalue'], ['asc']);
  const CountriesCwaCrs = _orderBy(Dictionary[30].datadictionary, ['description'], ['asc']);
  const CountriesWithNoMY = CountriesCwaCrs.filter((country) => country.codevalue !== 'MY');

  return {
    AnnualIncomeLOV,
    IdTypes,
    Occupation,
    SourceOfFunds,
    State,
    Business,
    Nationality,
    Country,
    Purpose,
    Interest,
    Gender,
    Title,
    MaritalStatus,
    Race,
    Banks,
    CountryCor,
    TaxResidentNoIDReasons,
    CountriesWithNoMY,
    CountriesCwaCrs,
  };
}
