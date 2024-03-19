import React, {useState} from 'react';
import {Box, Button, Card, TextField, Typography} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {
    ModifyBulletinBoardCommand,
    ModifyBulletinCommentCommand,
    ModifyBulletinPostCommand,
    ModifyBulletinReplyCommand
} from "~/apis";
import {NameValueList} from "@vizendjs/accent";
import {
    useBulletinBoardModify,
    useBulletinCommentModify,
    useBulletinPostModify,
    useBulletinReplyModify
} from "~/components";
import {useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab";

export const BulletinReplyModify = ({
                                        onSaved,
                                        onCancel,
                                    }: {
    onSaved?: () => void;
    onCancel?: () => void;
}) => {
    const {enqueueSnackbar} = useSnackbar();
    const params = useParams<{replyId:string}>();
    const {
        mutation: {modifyBulletinReply},
    } = useBulletinReplyModify();

    const [nameValueList, setNameValueList] = useState<NameValueList>({nameValues: []});

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        setValue,
    } = useForm<Partial<ModifyBulletinReplyCommand>>({
        defaultValues: {
            replyId: params.replyId,
            nameValueList: {nameValues : []} as NameValueList,
        },
    });

    const handleMutate = async () => {
        const onSuccess = async () => {
            const response = await modifyBulletinReply
                .mutateAsync({
                    nameValueList,
                    replyId:params.replyId
                }, {
                    onSuccess: () => enqueueSnackbar("Bulletin Reply has been modified successfully", {variant: 'success'}),
                })
                .catch((e) => {
                    console.log(e)
                    enqueueSnackbar(e.message, {variant: 'error'});
                });
            onSaved && onSaved();
        }
        if (confirm('Are you sure want to save?')) await onSuccess()
    };

    const handleCancel = () => onCancel && onCancel();

    const handleInputChange = (name: string, value: string) => {
        const existingIndex = nameValueList.nameValues.findIndex((nv) => nv.name === name);
        if (existingIndex !== -1) {
            const updatedNameValues = [...nameValueList.nameValues];
            updatedNameValues[existingIndex].value = value;
            setNameValueList({nameValues: updatedNameValues});
        } else {
            setNameValueList({nameValues: [...nameValueList.nameValues, {name, value}]});
        }
    };

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
                        Modify Bulletin Post
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
                                        label={'text'}
                                        error={!!errors?.nameValueList?.nameValues}
                                        // helperText={errors?.nameValueList && 'Title is required.'}
                                        {...register(`nameValueList.nameValues.${0}.${"text"}`, {required: false, maxLength: 200})}
                                        onChange={(e) => {
                                            // setValue('description', e.target.value);
                                            handleInputChange('text', e.target.value);
                                        }}
                                    />
                                )}
                                name='nameValueList.nameValues'
                                control={control}
                            />
                            <Controller
                                render={({field}) => (
                                    <TextField
                                        fullWidth
                                        label={'Display Name'}
                                        error={!!errors?.nameValueList?.nameValues}
                                        // helperText={errors?.nameValueList && 'Description is required.'}
                                        {...register(`nameValueList.nameValues.${1}.${"displayName"}`, {required: false, maxLength: 50})}
                                        onChange={(e) => {
                                            // setValue('description', e.target.value);
                                            handleInputChange('displayName', e.target.value);
                                        }}
                                    />
                                )}
                                name='nameValueList.nameValues'
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
                        <LoadingButton loading={modifyBulletinReply.isLoading} variant="contained" color="primary"
                                       type={'submit'}>
                            Modify
                        </LoadingButton>
                    </Box>
                </Card>


                ...
            </form>
        </>
    );
};
