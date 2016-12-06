
# coding: utf-8

# In[1]:

import pandas as pd
import numpy as np


# In[2]:

df = pd.read_csv('/tmp/fdimkts_allyears.csv')


# In[3]:

df


# In[9]:

df[ ['gvc', 'count', 'investment_mm', 'jobs'] ].dropna().describe()


# In[49]:

orig = df[ ['cont_orig','source_region_id_g'] ].dropna()
orig.columns = ['cont', 'region_id' ]
dest = df[ ['cont_dest', 'destination_region_id_g'] ].dropna()
dest.columns = ['cont', 'region_id' ]
pairs = pd.concat([orig, dest]).drop_duplicates().sort_values('region_id')
pairs
