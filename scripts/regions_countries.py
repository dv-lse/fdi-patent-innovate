
# coding: utf-8

# In[1]:

import pandas as pd
import numpy as np


# In[36]:

df = pd.read_csv('/tmp/file1.csv', encoding = "ISO-8859-1")


# In[39]:

aggdfmean = df.groupby(df['geoid_r']).agg({ 'GDPpc_rIp' : np.mean,
                                            'educ_rIp' : np.mean,
                                            'pop_rIp' : np.mean,
                                            'popd_rIp' : np.mean,
                                            'allpat' : np.mean })


# In[14]:

aggdf2005 = df[ df['appyear'] == 2005].set_index('geoid_r')[['GDPpc_rIp','educ_rIp','pop_rIp','popd_rIp','allpat']]


# In[40]:

aggdf2005.to_csv('/tmp/regions_countries.csv', encoding='utf-8', float_format='%.2f')
