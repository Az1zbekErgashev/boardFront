import {
    Box,
    Button,
    Card,
    TextField,
    Typography,
} from '@mui/material';
import {BulletinCommentCdo, FaqPostCdo} from '~/models';
import {useSnackbar} from 'notistack';

import {Controller, useForm} from 'react-hook-form';
import {useBulletinCommentRegister, useBulletinPostRegister,} from '../hooks';
import {useParams} from "react-router-dom";


export const BulletinCommentCreate = ({
                               onSaved,
                               onCancel,
                           }: {
    onSaved?: () => void;
    onCancel?: () => void;
}) => {
    const {enqueueSnackbar} = useSnackbar();
    const params = useParams<{postId:string}>();
    const {mutation: {registerBulletinComment},} = useBulletinCommentRegister();
    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<Partial<BulletinCommentCdo>>({
        defaultValues: {
            text: '',
            postId: params.postId,
        },
    });

    const handleMutate = async (data) => {
        const onSuccess = async () => {
            const response = await registerBulletinComment
                .mutateAsync({
                    text: data.text,
                    postId: data.postId,
                })
                .catch((e) => {
                    enqueueSnackbar(e.message, {variant: 'error'});
                });
            onSaved && onSaved();
        }
        if (confirm('Are you sure want to save?')) await onSuccess();
    };

    const handleCancel = () => onCancel && onCancel();

    return (
        <>
            <form onSubmit={handleSubmit(handleMutate)}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',
                    }}
                >
                    <Typography>
                        New Bulletin Comment
                    </Typography>
                    <Button variant="text" color="primary" sx={{display: 'flex', gap: '8px'}} onClick={handleCancel}>
                        Back
                    </Button>
                </Box>

                <Card sx={{p: 3}}>
                    <Box
                        sx={{
                            display: 'flex',
                            borderRadius: '8px',
                            padding: '40px 120px',
                            paddingRight: 0,
                            flexGrow: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                padding: '40px 120px',
                                paddingRight: 0,
                                flexGrow: 1,
                            }}
                        >
                            <Controller
                                render={({field}) => (
                                    <TextField
                                        fullWidth
                                        label={'Text'}
                                        error={!!errors?.text}
                                        helperText={
                                            errors?.text && 'Text is required.'}
                                        {...register('text', {required: true, maxLength: 20})}
                                    />
                                )}
                                name={'text'}
                                control={control}
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '20px',
                            paddingTop: '30px',
                        }}
                    >
                        <Button variant="outlined" color="primary" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" type={'submit'}>
                            Add
                        </Button>
                    </Box>
                </Card>
            </form>
        </>
    );
};

