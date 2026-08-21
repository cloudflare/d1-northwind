# Northwind Traders

The Northwind Traders demo presents records from the Northwind dataset and exposes how D1 serves the underlying queries.

## Language

**Search**:
A lookup within the Product or Customer list. Product searches match product name; Customer searches match company, contact, title, or address.
_Avoid_: Database search, global search

**Search target**:
The Product or Customer list where a search is performed. The current list determines the search target; users do not select it separately.
_Avoid_: Table, entity type
