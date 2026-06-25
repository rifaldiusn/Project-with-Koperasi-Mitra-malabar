import random
import datetime
import sys
import os

# Add current directory to path so 'app' can be imported
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.db.base import Base
from app.models import *

tables_to_ignore = ['akun', 'token', 'log']
tables = Base.metadata.tables

sql_statements = []
sql_statements.append("SET FOREIGN_KEY_CHECKS = 0;")

for table_name, table in tables.items():
    if table_name.lower() in tables_to_ignore:
        continue
    
    for i in range(1, 31):
        columns = []
        values = []
        for column in table.columns:
            columns.append(column.name)
            
            col_type = str(column.type).upper()
            col_name = column.name.lower()
            
            if column.primary_key and column.autoincrement:
                values.append(str(i))
            elif 'VARCHAR' in col_type or 'STRING' in col_type or 'TEXT' in col_type:
                if 'link' in col_name or 'url' in col_name or 'gambar' in col_name or 'file' in col_name or 'foto' in col_name:
                    values.append(f"'https://dummyimage.com/600x400/000/fff&text=Dummy+{i}'")
                elif 'email' in col_name:
                    values.append(f"'user{i}@example.com'")
                else:
                    values.append(f"'Dummy {col_name} {i}'")
            elif 'INT' in col_type or 'FLOAT' in col_type or 'NUMERIC' in col_type:
                if column.foreign_keys:
                    if col_name == 'id_akun':
                        t_lower = table_name.lower()
                        if t_lower == 'campaign':
                            values.append('4')
                        elif t_lower in ['customer', 'tahapan', 'target']:
                            values.append('3')
                        else:
                            values.append(str(random.randint(1, 30)))
                    else:
                        values.append(str(random.randint(1, 30)))
                else:
                    values.append(str(random.randint(1, 1000)))
            elif 'DATE' in col_type or 'TIME' in col_type:
                random_days = random.randint(0, 365)
                dt = datetime.datetime.now() - datetime.timedelta(days=random_days)
                values.append(f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'")
            elif 'BOOLEAN' in col_type or 'TINYINT' in col_type:
                values.append(str(random.choice([0, 1])))
            else:
                values.append("'Dummy'")
                
        col_str = ", ".join([f"`{c}`" for c in columns])
        val_str = ", ".join(values)
        sql_statements.append(f"INSERT INTO `{table_name}` ({col_str}) VALUES ({val_str});")

sql_statements.append("SET FOREIGN_KEY_CHECKS = 1;")

with open('dummy_data.sql', 'w') as f:
    f.write("\n".join(sql_statements))

print("Done")
