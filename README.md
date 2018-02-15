# Parental Leave

## Data
**data/companies.csv**

field | description | type
---|---|---
industry | |string
company ||string
city ||string
state ||string
country ||string
lat || latitude
lng || longitude
mat_paid | paid *maternal* leave in weeks | number
mat_unpaid | unpaid *maternal* leave in weeks | number
pat_paid | paid *paternal* leave in weeks | number
pat_unpaid | unpaid *paternal* leave in weeks | number
rating | women's ratings of the company | number (1-5)
treatedFairly | % of users who say women are treated fairly and equally to men | number (%)
wouldRecommend | % of users who would recommend to other women | number (%)
match401k | Does the company offer 401k matching? | boolean
childcare | Does the company offer on-site childcare? | boolean
flextime | Does the company offer flextime? | boolean
healthcare | Does the company offer healthcare benefits? | boolean
vacationAllowance | consensus on vacation allowance in weeks | number
balance | % of women who say better work life balance would help retain them | number (%)
culture | % of women who say the company has family-friendly culture | number (%)
flexibility | how flexible users think the company is | number (1-5)
hours | % of women who say the company has family-friendly hours | number (%)
policies | % of women who say the company has family-friendly policies | number (%)

**data/countries.json**

field | description | type
---|---|---
country || string
region |UN-assigned region|string
countryCode||number
matLeaveLength|*maternal* leave length, in weeks|number
matLeaveLengthFootnote|notes|string
wagesPaid|Percentage of wages paid while on maternal leave|number
wagesPaidFootnote|notes|string
