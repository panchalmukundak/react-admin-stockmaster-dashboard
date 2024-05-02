import { useEffect, useState } from 'react';
import {
    Typography,
    Stack,
    Grid,
    CircularProgress,
} from '@mui/material';
import { getAllInventories, getUserLocalStorage } from '../../util/util';
import CustomCardInventory from '../CustomCardInventory/CustomCardInventory';

const ListInventory = () => {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const accessToken = getUserLocalStorage().token;
    const userId = getUserLocalStorage().id;
    const userName = getUserLocalStorage().userName;

    const handleDeleteInventory = async (inventoryName) => {
        try {
            const updatedInventories = inventories.filter(inventory => inventory.name !== inventoryName);
            setInventories(updatedInventories);
        } catch (error) {
            console.log("Erro ao excluir o inventário:", error);
        }
    };

    useEffect(() => {
        const headersConfig = { 
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            } 
        };

        const checkInventory = async () => {
            try {
                const result = await getAllInventories(userId, headersConfig);
                setInventories(result.data);
            } catch (error) {
                console.log("Erro ao retornar a lista de inventarios.");
            } finally {
                setLoading(false);
            }
        }

        checkInventory();
    }, [accessToken, userId, inventories]);

    return (
        <Stack component="section" alignSelf="center" mx={5}>
            {loading ? (
                <Grid container justifyContent="center">
                    <CircularProgress color="warning" />
                </Grid>
            ) : inventories.length > 0 ? ( // Verifica se há inventários disponíveis
                <>
                    <Typography 
                        variant="h3" 
                        component="p" 
                        align="right" 
                        sx={{
                            fontWeight: 700,
                            color: "#a1a4ab",
                            mb: 3,
                        }} 
                        gutterBottom
                    >   
                    <span style={{color: "#f8a", textTransform:"capitalize"}}>
                        {userName}
                    </span>, seus estoques estão com saudades!
                    </Typography>
                    
                    <Grid container spacing={3}>
                        {inventories.map((item, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <CustomCardInventory 
                                    name={item.name} 
                                    description={item.description}
                                    onDelete={() => handleDeleteInventory(item.name)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <Typography variant="h3" align="center">
                    Você não adicionou nenhum estoque.
                </Typography>
            )}
        </Stack>
    )
}

export default ListInventory;
